<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RepairDocumentsController extends Controller
{
    public function listDocuments(){
        // Get document path and return 
        return Inertia::render('documents/documents');
    }
}
