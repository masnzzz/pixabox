<?php

use Illuminate\Http\Request;

// ????
Route::post('/register', 'Auth\RegisterController@register')->name('register');

// ????
Route::post('/login', 'Auth\LoginController@login')->name('login');
