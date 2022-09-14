<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function createComment(Request $request, $post_id)
    {
        $user_id = $request->user()->id;
        $content = $request['content'];

        $create = Comment::create([
            'user_id' => $user_id,
            'post_id' => $post_id,
            'content' => $content
        ]);

        return $create;
    }

    public function deleteComment(Request $request, $comment_id)
    {
        $user_id = $request->user()->id;
        $comment = Comment::where('id', $comment_id)->where('user_id', $user_id)->delete();

        if ($comment)
            return true;
        return false;
    }

    public function updateComment(Request $request, $comment_id)
    {
        $content = $request['content'];
        $comment = Comment::where('id', $comment_id)->first();

        if ($comment) {
            $comment->update([
                'content' => $content
            ]);
            return true;
        }
        return false;
    }

    public function getCommentsPost(Request $request, $post_id)
    {
        return Comment::join('users', 'users.id', '=', 'comment.user_id')
            ->where('post_id', $post_id)
            ->get(['comment.*', 'users.name', 'users.id']);
    }
}
