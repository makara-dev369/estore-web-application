<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    public function list(
        string $sortField = 'id',
        string $sortDirection = 'asc',
        int $perPage = 10
    ): LengthAwarePaginator {
        return Product::orderBy($sortField, $sortDirection)->paginate($perPage);
    }

    public function store() {}
    public function update() {}
    public function destoy() {}
}
