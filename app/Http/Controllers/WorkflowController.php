<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkflowController extends Controller
{
    public function index()
    {
        return Inertia::render('Automation/Automation');
    }

    public function create(Request $request)
    {
        dd($request->all());
        return Inertia::render('Automation/Automation', ['request' => $request->all()]);
    }
}
