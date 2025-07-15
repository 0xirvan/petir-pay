<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'photo_profile',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'photo_profile_url'
    ];


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user has administrator role
     */
    public function isAdministrator(): bool
    {
        return $this->role === 'administrator';
    }

    /**
     * Check if user has petugas role
     */
    public function isPetugas(): bool
    {
        return $this->role === 'petugas';
    }

    /**
     * Check if user has specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Get the full URL for the user's profile photo
     */
    public function getPhotoProfileUrlAttribute(): string
    {
        if ($this->photo_profile) {
            return asset('storage/' . $this->photo_profile);
        }

        $initials = collect(explode(' ', $this->name))
            ->map(fn($word) => strtoupper(substr($word, 0, 1)))
            ->take(2)
            ->implode('');

        return "https://ui-avatars.com/api/?name={$initials}&background=random&color=fff&size=200";
    }

}
