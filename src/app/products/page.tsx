"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  Loader2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  _id: string;
  title: string;
  description: string;
  basePrice: number;
  images: string[];
  category: string;
  sellerId?: {
    vendorDetails?: {
      storeName?: string;
    };
  };
}

export default function MarketplaceDiscoveryPage() {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // List of product categories aligned with our database model values
  const categories = [
    { label: "All Assets", value: "" },
    { label: "Tech & Devices", value: "electronics" },
    { label: "Apparel & Fashion", value: "apparel" },
    { label: "SaaS & Software", value: "software" },
    { label: "Digital Graphics", value: "design" },
  ];

  // Fetch products from our API using standard query streaming via Axios
  const fetchCatalog = async (pageTarget = 1) => {
    setLoading(true);
    try {
      const params: any = { page: pageTarget, limit: 9 };
      if (searchQuery) params.search = searchQuery;
      if (activeCategory) params.category = activeCategory;

      const response = await axios.get("/api/products", { params });
      if (response.status === 200) {
        setProducts(response.data.products);
        setPagination({
          page: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("MARKETPLACE_UI_AXIOS_ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search execution when category filters change or search term is processed
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCatalog(1);
    }, 400); // 400ms debounce buffer to limit rapid API database pool hammering

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 min-h-screen">
      {/* Search Header Banner Area */}
      <div className="space-y-4 text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold font-plus-jakarta tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-purple-400">
          Discover Premium Inventions
        </h1>
        <p className="text-sm text-zinc-400">
          Acquire production-tier technical solutions, curated apparel assets,
          and commercial software licensing direct from verified global
          creators.
        </p>
      </div>

      {/* Filter and Search Controller Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/[0.06] pb-8 mb-8">
        {/* Dynamic Category Pill Boxes */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-center md:justify-start">
          <SlidersHorizontal className="h-4 w-4 text-zinc-500 mr-2 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all border ${
                activeCategory === cat.value
                  ? "bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-500/30 text-purple-400 shadow-md"
                  : "bg-white/[0.01] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Global Semantic Input Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search catalog collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200 text-sm h-10 w-full"
          />
        </div>
      </div>

      {/* Core Dynamic Content Canvas Grid Display */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-xs font-mono text-zinc-500">
            Querying semantic indices...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="h-64 rounded-2xl border border-dashed border-white/[0.06] bg-white/[0.01] flex flex-col items-center justify-center text-center p-6">
          <ShoppingBag className="h-10 w-10 text-zinc-600 mb-3" />
          <h3 className="text-zinc-300 font-bold font-plus-jakarta">
            No matching results discovered
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mt-1">
            Refine your active dashboard parameters or clear category filtration
            blocks.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.01] border border-white/[0.05] hover:border-purple-500/20 shadow-xl transition-all duration-300"
              >
                {/* Product Thumbnail Asset Frame Layout */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-950 relative border-b border-white/[0.04]">
                  <img
                    src={
                      product.images[0] ||
                      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600"
                    }
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase bg-[#030014]/80 backdrop-blur-md text-purple-400 px-2.5 py-1 rounded-md border border-white/10">
                    {product.category}
                  </span>
                </div>

                {/* Info Text Space Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 font-medium">
                      Store:{" "}
                      {product.sellerId?.vendorDetails?.storeName ||
                        "Independent Creator"}
                    </p>
                    <h3 className="font-bold text-zinc-100 tracking-tight font-plus-jakarta text-lg line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 pt-1 font-normal leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                        Price Variant
                      </p>
                      <span className="text-xl font-black font-plus-jakarta text-zinc-100">
                        ${product.basePrice.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-white/5 hover:bg-purple-600 border border-white/10 text-zinc-200 hover:text-white rounded-xl text-xs gap-1.5 transition-all"
                    >
                      <span>View Specifications</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Core Simple Pagination Navigation Controls Component Layout */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4 border-t border-white/[0.06]">
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => fetchCatalog(pagination.page - 1)}
                className="text-xs text-zinc-400 hover:text-white disabled:opacity-30 rounded-xl"
              >
                Previous Page
              </Button>
              <span className="text-xs font-mono text-zinc-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchCatalog(pagination.page + 1)}
                className="text-xs text-zinc-400 hover:text-white disabled:opacity-30 rounded-xl"
              >
                Next Page
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
