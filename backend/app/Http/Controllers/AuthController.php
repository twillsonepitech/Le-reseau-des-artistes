<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Actions\Jetstream\DeleteUser;
use App\Models\Bookmarks;
use App\Models\User;
use App\Models\Post;
use App\Models\Favorite;
use App\Models\Comment;
use Illuminate\Support\Facades\Response;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function me(Request $request)
    {
        return $request->user();
    }

    public function deleteUser(Request $request)
    {
        $user = $request->user();
        $post = Post::where('post.user_id', $user->id)->delete();
        $favorite = Favorite::where('favorite.user_id', $user->id)->delete();
        $bookmarks = Bookmarks::where('bookmarks.user_id', $user->id)->delete();
        $comment = Comment::where('comment.user_id', $user->id)->delete();
        $user->deleteProfilePhoto();
        $user->tokens->each->delete();
        $user->delete();
        return response()->json(true, 200);
    }
}
