<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Users;

class UsersController extends Controller
{
    public function login(Request $request){
        try{
            $res = null;
            $status = null;
            $req = $request->all();
            $credentials = Response()->json($req)->original;
            $query = Users::where([
                                    ['email',$credentials['email']], 
                                    ['password',$credentials['password']]
                                ])->first(); 
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

    }

    public function adduser(Request $request){
        try{
            $res = null;
            $status = null;
            $req = $request->all();
            $credentials = Response()->json($req)->original;
            $query = Users::where('email',$credentials['email'])->first();
            if(empty($query)){
                $res = Users::create([
                    'email' => $credentials['email'],
                    'password' => $credentials['addpassword']
                ]);
                $status = 200;
            } else{
                $res = array('error' => 'User already exist');
                $status = 401;    
            }
            
            return Response()->json($res,$status);
            
         }catch(Exception $err){
            return Response()->json(array('error' => $err), 500);
         }

    }

    public function getAllUsers(){
        try{
        
            //$allUsers = DB::select("SELECT email FROM users_tbl");        
            $allUsers = Users::all('email');
            return Response()->json(array('allUsers' => $allUsers),200);
             
         }catch(Exception $err){
             return Response()->json(array('error' => $err->errorInfo), 500);
         }
    }
}
