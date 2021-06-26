<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Todos extends Model
{
    protected $table = 'todos_tbl';
    protected $fillable = ['email', 'todo','is_done','is_shared','shared_with'];
    public $timestamps = false;
}
