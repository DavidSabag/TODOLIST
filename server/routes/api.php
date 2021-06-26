<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

Route::post('/login', 'UsersController@login');
Route::post('/adduser', 'UsersController@adduser');
Route::post('/addtask', 'TodosController@addtask');
Route::get('/getTasks/{email}', 'TodosController@getTasks');
Route::delete('/removeTask/{email}/{task}', 'TodosController@removeTask');
Route::put('/updateTask', 'TodosController@updateTask');
Route::get('/getAllUsers', 'UsersController@getAllUsers');
Route::get('/getUsersShare/{user}/{task}', 'TodosController@getUsersShare');

Route::put('/shareTask', 'TodosController@shareTask');



function generateRandomToken($length = 50) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
