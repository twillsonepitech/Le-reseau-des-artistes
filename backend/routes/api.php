<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/posts', [PostController::class, 'getPosts'])->middleware('auth:sanctum');
Route::get('/posts/{user_id}', [PostController::class, 'getPostsUser'])->middleware('auth:sanctum');

Route::delete('post/{id}', [PostController::class, 'deletePost'])->middleware('auth:sanctum');

Route::delete('deleteUser', [AuthController::class, 'deleteUser'])->middleware('auth:sanctum');

Route::post('/post', [PostController::class, 'createPost'])->middleware('auth:sanctum');
Route::post('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::post('/favorite/{id}', [PostController::class, 'likePost'])->middleware('auth:sanctum');
Route::post('/dislike/{id}', [PostController::class, 'dislikePost'])->middleware('auth:sanctum');
Route::get('/postsLiked/{user_id}', [PostController::class, 'postsLiked'])->middleware('auth:sanctum');

Route::get('/getPost/{post_id}', [PostController::class, 'getPost'])->middleware('auth:sanctum');

Route::post('/savePost/{id}', [PostController::class, 'savePost'])->middleware('auth:sanctum');
Route::post('/unsavePost/{id}', [PostController::class, 'unsavePost'])->middleware('auth:sanctum');
Route::get('/postsSaved/{user_id}', [PostController::class, 'postsSaved'])->middleware('auth:sanctum');

Route::post('/createComment/{post_id}', [CommentController::class, 'createComment'])->middleware('auth:sanctum');
Route::delete('/deleteComment/{comment_id}', [CommentController::class, 'deleteComment'])->middleware('auth:sanctum');
Route::put('/updateComment/{comment_id}', [CommentController::class, 'updateComment'])->middleware('auth:sanctum');
Route::get('/getCommentsPost/{post_id}', [CommentController::class, 'getCommentsPost'])->middleware('auth:sanctum');

Route::get('auth/redirect', [])->middleware('auth:sanctum');
Route::get('auth/callback', [])->middleware('auth:sanctum');