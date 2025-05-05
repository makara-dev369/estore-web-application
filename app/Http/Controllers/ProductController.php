<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        $data =  $this->productService->list(
            $request->sort_field ?? "id",
            $request->sort_direction ?? "desc",
            $request->per_page ?? 10,
        );
        return Inertia::render('products/Index', [
            "data" => $data
        ]);
    }
    public function create() {}
    public function store() {}
    public function edit() {}
    public function show() {}
    public function update() {}
    public function destroy() {}
}
