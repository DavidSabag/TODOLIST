<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

Route::post('/login', function(Request $request) {
    try{
        $res = null;
        $status = null;
        $req = $request->all();
        $credentials = Response()->json($req)->original;
        $query = DB::select("SELECT * FROM users_tbl WHERE email=? AND password=?",array($credentials['email'], $credentials['password']));
        if(!empty($query)){
            $res = array('token' => generateRandomToken());    
            $status = 200;
        } else{
            $res = array('error' => 'User not found');
            $status = 401;    
        }
        return Response()->json($res,$status);
        
    }catch(Exception $err){
        return Response()->json(array('error' => $err->errorInfo), 500);
    }
});


Route::post('/adduser', function(Request $request) {
   try{
        $res = null;
        $status = null;
        $req = $request->all();
        $credentials = Response()->json($req)->original;
        $query = DB::select("SELECT * FROM users_tbl WHERE email=?",array($credentials['email']));
        if(empty($query)){
            $res = DB::insert("INSERT INTO users_tbl (email,password) VALUES (?,?) ",array($credentials['email'], $credentials['addpassword']));
            $status = 200;
        } else{
            $res = array('error' => 'User already exist');
            $status = 401;    
        }
        
        return Response()->json($res,$status);
        
     }catch(Exception $err){
        return Response()->json(array('error' => $err), 500);
     }
});

Route::post('/addtask', function(Request $request) {
    try{
        
        $req = $request->all();
        $credentials = Response()->json($req)->original;
        DB::insert("INSERT INTO todos_tbl (email, todo, is_done, is_shared) VALUES (?,?,?,?)",array($credentials['email'], $credentials['todo'],false, false));
        $res = DB::select("SELECT * FROM todos_tbl WHERE email=? AND todo=?",array($credentials['email'], $credentials['todo']));            
        return Response()->json($res[0],200);
        
    }catch(Exception $err){
        return Response()->json(array('error' => $err->errorInfo), 500);
    }
});


Route::get('/getTasks/{email}', function($email) {
    try{
        
       $todos = DB::select("SELECT * FROM todos_tbl WHERE email=? ",array($email));        
       return Response()->json(array('todos' => $todos),200);
        
    }catch(Exception $err){
        return Response()->json(array('error' => $err->errorInfo), 500);
    }
});

Route::delete('/removeTask/{email}/{task}', function($email,$task) {
    try{
       $deletedRows = DB::delete("DELETE FROM todos_tbl WHERE email=? AND todo=?",array($email, $task)); 
       $todos_tbl = DB::select("SELECT * FROM todos_tbl WHERE email=?",array($email)); 
       return Response()->json($todos_tbl, 200);
        
    }catch(Exception $err){
        return Response()->json(array('error' => $err->errorInfo), 500);
    }
});

Route::put('/updateTask', function(Request $request) {
    try{
        
        $req = $request->all();
        $details = Response()->json($req)->original;
        $res = DB::select("UPDATE todos_tbl SET is_done = !is_done WHERE email=? AND todo=?",array($details['email'], $details['todo']));
        $todos_tbl = DB::select("SELECT * FROM todos_tbl WHERE email=?",array($details['email'])); 
        return Response()->json($todos_tbl, 200);
        
    }catch(Exception $err){
        return Response()->json(array('error' => $err->errorInfo), 500);
    }
});

Route::get('/getUsersShare/{task}', function($task) {
    try{      
        $shares = DB::select("  SELECT ut.email , 0 as is_shared
                                FROM users_tbl ut, (SELECT DISTINCT email, is_shared 
                                                    FROM todos_tbl
                                                    WHERE is_shared=true ) shr
                                WHERE ut.email != shr.email                            
                                UNION
                                SELECT DISTINCT email, is_shared FROM todos_tbl
                                WHERE is_shared=true 
                                                    
                            ", array($task)); 
        if(empty($shares)){
            $shares = DB::select("SELECT email , 0 as is_shared FROM users_tbl");
        }       

       return Response()->json(array('shares' => $shares),200);
        
    }catch(Exception $err){
        return Response()->json(array('error' => $err->errorInfo), 500);
    }
});

Route::put('/shareTask', function(Request $request) {
    try{
        
        $req = $request->all();
        $shareDetails = Response()->json($req)->original;
        //var_dump($shareDetails);
        DB::update("UPDATE todos_tbl 
                    SET 
                        is_shared=true, 
                        shared_with=?
                        
                    WHERE email=? AND todo=? ",array($shareDetails['shared_with'],$shareDetails['user'], $shareDetails['taskToReflect']));
        
        DB::insert("INSERT INTO todos_tbl (email, todo, is_done, is_shared, shared_with) 
                    VALUES (?,?,?,?,?)",array($shareDetails['shared_with'], $shareDetails['taskToReflect'],$shareDetails['is_done'], true, $shareDetails['user']));
        
        
        
        $res = DB::select("SELECT * FROM todos_tbl ");            
        return Response()->json($res,200);
        
    }catch(Exception $err){
        return Response()->json(array('error' => $err->errorInfo), 500);
    }
});








function generateRandomToken($length = 50) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
