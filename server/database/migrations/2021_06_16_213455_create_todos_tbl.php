<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTodosTbl extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('todos_tbl', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('email');
            $table->string('todo');
            $table->boolean('is_done');
            $table->boolean('is_shared');
            $table->string('shared_with')->default('');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('todos_tbl');
    }
}
