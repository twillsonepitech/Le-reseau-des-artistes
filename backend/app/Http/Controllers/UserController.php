<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()     {  }

    public function getUser()
    {
        return User::get();
    }
}
