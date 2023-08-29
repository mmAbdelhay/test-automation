<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;


class WorkflowController extends Controller
{

    public function index()
    {
        return Inertia::render('Automation/Index', ['workflows' => Workflow::with('user')->get()]);
    }

    public function create()
    {
        return Inertia::render('Automation/Automation');
    }

    public function show(Workflow $workflow)
    {
        $fileContent = Storage::get($workflow->path);
        return Inertia::render('Automation/Show', ['workflow' => $workflow, 'file' => $fileContent]);
    }

    public function store(Request $request)
    {
        $middleContent = $this->getFileContent('first-default-test.txt');
        $middleContent .= 'await page.goto("' . env('APP_URL') . '/' . $request->start_point . '");';
        $lastContent = $this->getFileContent('last-default-test.txt');


        foreach ($request->recorded_actions as $recorded_action) {
            switch ($recorded_action['type']) {
                case "keydown" :
                    if (array_key_exists('key', $recorded_action))
                        $middleContent .= '
                            await page.type("' . $recorded_action['target'] . '", "' . $recorded_action['key'] . '");
                            await new Promise(resolve => setTimeout(resolve, 200));
                         ';
                    break;
                case "click":
                    $middleContent .= '
                         await page.waitForSelector("' . $recorded_action['target'] . '");
                         await page.click("' . $recorded_action['target'] . '");
                         await new Promise(resolve => setTimeout(resolve, 500));
                    ';
                    break;
            }
        }

        $middleContent .= $lastContent;

        $path = $this->createJavaScriptFileFromString($middleContent);

        Workflow::create([
            'workflow' => json_encode($request->recorded_actions),
            'domain' => $request->start_point,
            'user_id' => auth()->id(),
            'path' => $path,
            'name' => $request->name
        ]);

        return Inertia::render('Automation/Automation', ['request' => $request->all()]);
    }

    public function run(Workflow $workflow)
    {
        $command = "node storage/app/" . $workflow->path . " > " . storage_path('app/tests/output/output.txt') . " 2>&1 & echo $!";
        chdir(base_path());
        $pid = exec($command, $output, $exitCode);

        $process = \App\Models\Process::create([
            'process_id' => $pid,
            'user_id' => auth()->id(),
            'workflow_id' => $workflow->id
        ]);

        return Inertia::render('Automation/Show', [
            'process' => $process, 'processInstance' => $pid,
        ]);
    }

    public function stop(Workflow $workflow, \App\Models\Process $process)
    {
        abort_if($process->workflow->id !== $workflow->id, 'process must be a child of this workflow');
        exec("kill $process->id");
        return Inertia::render('Automation/Show');
    }

    public function getFileContent($fileName)
    {
        $filePath = base_path('tests/Automation/' . $fileName);

        if (File::exists($filePath)) {
            return file_get_contents($filePath);
        } else {
            abort(403, 'Files stub not found in test directory');
        }
    }

    public function createJavaScriptFileFromString($stringContent)
    {
        $path = 'tests/Automation/' . auth()->id() . "/" . auth()->user()->name . '_' . now() . ".js";
        Storage::put($path, $stringContent);
        return $path;
    }

    public function changeTestFileContent(Workflow $workflow, Request $request)
    {
        file_put_contents(storage_path("app/$workflow->path"), $request->newCode);
        return Inertia::render('Automation/Show');
    }
}
