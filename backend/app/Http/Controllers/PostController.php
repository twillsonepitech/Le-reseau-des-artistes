<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\Favorite;
use App\Models\Bookmarks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use function PHPUnit\Framework\throwException;

class PostController extends Controller
{
    public function createPost(Request $request)
    {
        $user_id = $request->user()->id;
        $content = $request['content'];
        $has_file = $request['has_file'];

        $newPost = Post::create([
            'content' => $content,
            'user_id' => $user_id,
            'nb_favorite' => 0,
            'has_file' => $has_file
        ]);

        $post = Post::join('users', 'users.id', '=', 'post.user_id')
            ->where('post.id', $newPost->id)
            ->get(['post.*', 'users.name']);

        return $post;
    }

    public function deletePost(Request $request, $id)
    {
        $user_id = $request->user()->id;

        Favorite::where('post_id', $id)->delete();
        Bookmarks::where('post_id', $id)->delete();
        Comment::where('post_id', $id)->delete();
        $post = Post::where('post.user_id', $user_id)->where('post.id', $id)->delete();

        if ($post === 0)
            return false;
        return true;
    }

    public function getPosts(Request $request)
    {
        $user_id = $request->user()->id;

        $db = DB::select(DB::raw("SELECT EXISTS(select 1 from favorite fa where fa.post_id = p.id and fa.user_id = u.id limit 1) as liked, EXISTS(select 1 from bookmarks fa where fa.post_id = p.id and fa.user_id = u.id limit 1) as saved,
        up.name, up.id as userId, p.id as id, p.content, p.created_at, p.has_file, (select count(distinct l.user_id) from favorite l where l.post_id = p.id) as likes FROM users u, users up inner join post p on up.id = p.user_id WHERE u.id = '$user_id'"));
        return $db;
    }

    public function getPostsUser(Request $request)
    {
        $user_id = $request['user_id'];

        return Post::where('user_id', $user_id)->get();
    }

    public function getPost(Request $request, $post_id)
    {
        $user_id = $request->user()->id;

        $db = DB::select(DB::raw("SELECT EXISTS(select 1 from favorite fa where fa.post_id = p.id and fa.user_id = u.id limit 1) as liked, EXISTS(select 1 from bookmarks fa where fa.post_id = p.id and fa.user_id = u.id limit 1) as saved,
        up.name, up.id as userId, p.id as id, p.content, p.created_at, p.has_file, (select count(distinct l.user_id) from favorite l where l.post_id = p.id) as likes FROM users u, users up inner join post p on up.id = p.user_id WHERE u.id = '$user_id' AND p.id = '$post_id'"));

        return $db;
    }

    public function likePost(Request $request, $post_id)
    {
        $post = Post::where('post.id', $post_id)->first();
        if (isset($post)) {
            Favorite::create([
                'user_id' => $request->user()->id,
                'post_id' => $post_id
            ]);
            return true;
        }
        return false;
    }

    public function dislikePost(Request $request, $post_id)
    {
        $post = Post::where('post.id', $post_id)->first();
        if (isset($post)) {
            Favorite::where('user_id', $request->user()->id)->where('post_id', $post_id)->delete();
            return true;
        }
        return false;
    }

    public function postsLiked(Request $request, $user_id)
    {
        return DB::table('favorite')
            ->select('content', 'name', 'has_file', 'post.created_at', 'favorite.post_id', 'favorite.user_id')
            ->join('post','post.id','=','favorite.post_id')
            ->join('users','users.id','=','post.user_id')
            ->where('favorite.user_id', '=', $user_id)
            ->get();
    }

    public function savePost(Request $request, $post_id)
    {
        $post = Post::where('post.id', $post_id)->first();
        if (isset($post)) {
            Bookmarks::create([
                'user_id' => $request->user()->id,
                'post_id' => $post_id
            ]);
            return true;
        }
        return false;
    }

    public function unsavePost(Request $request, $post_id)
    {
        $post = Post::where('post.id', $post_id)->first();
        if (isset($post)) {
            Bookmarks::where('user_id', $request->user()->id)->where('post_id', $post_id)->delete();
            return true;
        }
        return false;
    }

    public function postsSaved(Request $request, $user_id)
    {
        return DB::table('bookmarks')
            ->select('content', 'name', 'has_file', 'post.created_at', 'bookmarks.post_id', 'bookmarks.user_id')
            ->join('post','post.id','=','bookmarks.post_id')
            ->join('users','users.id','=','post.user_id')
            ->where('bookmarks.user_id', '=', $user_id)
            ->get(['post.*']);
    }
}
