<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Todos;
use Illuminate\Support\Facades\DB;

class TodosController extends Controller
{
    public function getTasks($email){
        try{
            $todos = Todos::where('email',$email)->get();
            return Response()->json(array('todos' => $todos),200);
             
         }catch(Exception $err){
             return Response()->json(array('error' => $err->errorInfo), 500);
         }
    
    }
    public function addtask(Request $request){
        try{
        
            $req = $request->all();
            $credentials = Response()->json($req)->original;
            Todos::create([
                'email' => $credentials['email'],
                'todo' => $credentials['todo'],
                'is_done' => false,
                'is_shared' => false
            ]);
            $res = Todos::where([
                ['email', $credentials['email']],
                ['todo', $credentials['todo']]
            ])->first();
            return Response()->json($res,200);
            
        }catch(Exception $err){
            return Response()->json(array('error' => $err->errorInfo), 500);
        }

    }
    public function removeTask($email, $task){
        try{
            $deletedRows = Todos::where([
                ['email',$email],
                ['todo',$task]
            ])->delete();

            $todos_tbl = Todos::where([
                ['email',$email]
            ])->get();
            return Response()->json($todos_tbl, 200);
             
         }catch(Exception $err){
             return Response()->json(array('error' => $err->errorInfo), 500);
         }

    }
    public function updateTask(Request $request){
        try{
        
            $req = $request->all();
            $details = Response()->json($req)->original;
            $res = DB::select("UPDATE todos_tbl SET is_done = !is_done WHERE email=? AND todo=?",array($details['email'], $details['todo']));
            $todos_tbl = Todos::where('email',$details['email'])->get();
            
            $ttble = Todos::where('email',$details['email'])->where('todo',$details['todo'])->first();
            $ttbls = Todos::where('shared_with',$details['email'])->where('todo',$details['todo'])->first();

                Todos::where('email',$ttble->shared_with)
                    ->where('todo',$ttble->todo)
                    ->where('shared_with',$ttble->email)
                    ->update(array('is_done'=>$ttble->is_done));

            return Response()->json($todos_tbl, 200);
            
        }catch(Exception $err){
            return Response()->json(array('error' => $err->errorInfo), 500);
        }

    }
    public function getUsersShare($user,$task){
        try{      
            $shares = Todos::select('shared_with','is_shared')
                            ->where('todo',$task)
                            ->where('shared_with','!=','')
                            ->distinct('shared_with')
                            ->get();
       
           return Response()->json(array('shares' => $shares),200);
            
        }catch(Exception $err){
            return Response()->json(array('error' => $err->errorInfo), 500);
        }

    }
    public function shareTask(Request $request){
        try{
        
            $req = $request->all();
            $shareDetails = Response()->json($req)->original;
    
            if($shareDetails['is_shared']){
                Todos::where('email',$shareDetails['user'])
                       ->where('todo',$shareDetails['taskToReflect'])
                       ->update(array('is_shared'=>$shareDetails['is_shared'],
                                     'shared_with'=> $shareDetails['shared_with']));
                Todos::create([
                    'email' => $shareDetails['shared_with'],
                    'todo' => $shareDetails['taskToReflect'],
                    'is_done' => $shareDetails['is_done'],
                    'is_shared' => true,
                    'shared_with' => $shareDetails['user']
                ]);
            }
            else{
                
                Todos::where('email',$shareDetails['user'])
                      ->where('todo',$shareDetails['taskToReflect'])
                      ->update(array('is_shared'=>$shareDetails['is_shared'],
                                    'shared_with'=> ''));
    
                $deletedRows = Todos::where([
                    ['email',$shareDetails['shared_with']],
                    ['todo',$shareDetails['taskToReflect']],
                    ['shared_with',$shareDetails['user']]
                ])->delete();
            }
        
            $res = Todos::select("shared_with")
                          ->where("shared_with","!=","")
                          ->distinct("shared_with")
                          ->get();

            $todos_tbl = Todos::where('email',$shareDetails['user'])->get();

            return Response()->json($todos_tbl,200);
            
        }catch(Exception $err){
            return Response()->json(array('error' => $err->errorInfo), 500);
        }

    }


}
