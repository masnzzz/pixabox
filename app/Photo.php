<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Arr;

class Photo extends Model
{
    /** 
     * プライマリキーの型
     */
    protected $keyType = 'string';

    /**
     * JSONに含める属性
     */
    protected $appends = [
        'id', 'owner', 'url',
    ];
    
    /** 
     * IDの桁数
     */
    const ID_LENGTH = 12;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        if (! Arr::get($this->attributes, 'id')) {
            $this->setId();
        }
    }



    /**
     * ランダムなID値をid属性に代入する
     */
    private function setId(): void
    {
        $this->attributes['id'] = $this->getRandomId();
    }



    /**
     * ランダムなID値を生成する
     * @return string
     */
    private function getRandomId(): string
    {
        $characters = array_merge(
            range(0, 9), range('a', 'z'),
            range('A', 'Z'), ['-', '_']
        );

        $length = count($characters);

        $id = "";

        for ($i = 0; $i < self::ID_LENGTH; $i++) {
            $id .= $characters[random_int(0, $length - 1)];
        }

        return $id;
    }



    /**
     * リレーションシップ - usersテーブル
     * @return BelongsTo
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo('App\User', 'user_id', 'id', 'users');
    }



    /**
     * アクセサ - url
     * @return string
     */
    public function getUrlAttribute()
    {
        return Storage::cloud()->url($this->attributes['filename']);
    }
}
