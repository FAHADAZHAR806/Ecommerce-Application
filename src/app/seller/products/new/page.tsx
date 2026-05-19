"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import {
  Loader2,
  ShoppingBag,
  Tag,
  DollarSign,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { productFormSchema, ProductFormInput } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput>({
    // Explicitly type-cast the validation resolver to enforce absolute compliance
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      category: "electronics",
      title: "",
      description: "",
      imageUrl: "",
      sku: "",
      basePrice: 0,
      stock: 0,
    },
  });

  const onSubmit = async (data: ProductFormInput) => {
    setIsLoading(true);
    try {
      // Reformat flattened single-variant dashboard form parameters to conform to our nested array Product model blueprint
      const formattedPayload = {
        title: data.title,
        description: data.description,
        category: data.category,
        basePrice: data.basePrice,
        images: [data.imageUrl],
        variants: [
          {
            name: "Standard Edition",
            sku: data.sku.toUpperCase(),
            price: data.basePrice,
            stock: data.stock,
          },
        ],
      };

      // MANDATORY RULE: Strictly executing catalog transmission via configured Axios pipeline
      const response = await axios.post("/api/products", formattedPayload);

      if (response.status === 201) {
        toast.success("Inventory asset cataloged successfully!");
        router.push("/seller");
        router.refresh();
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Failed to commit product listing data.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 relative z-10">
      <Card className="bg-white/[0.02] border-white/[0.06] backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-plus-jakarta tracking-tight text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-purple-400" />
            <span>List New Inventory Item</span>
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Deploy production asset variables directly into global marketplace
            discoverability indexes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Title Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-zinc-300 font-medium text-xs"
                >
                  Product Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Premium Ergonomic Mechanical Keyboard"
                  {...register("title")}
                  className="bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200"
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="text-xs text-red-400 font-medium">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category Dropdown Selection Mock Layout */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-zinc-300 font-medium text-xs"
                >
                  Category Classification
                </Label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full h-10 px-3 bg-[#09090b] border border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200 text-sm outline-none transition-all"
                  disabled={isLoading}
                >
                  <option value="electronics">
                    Electronics & Tech Devices
                  </option>
                  <option value="apparel">Premium Apparel & Fashion</option>
                  <option value="software">SaaS Licensing & Software</option>
                  <option value="design">Digital Graphics Assets</option>
                </select>
              </div>
            </div>

            {/* Product Description Field */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-zinc-300 font-medium text-xs"
              >
                Technical Description
              </Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Detail high-performance capabilities, operational features, warranty guarantees..."
                {...register("description")}
                className="w-full p-3 bg-white/[0.02] border border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200 text-sm outline-none transition-all resize-none"
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-xs text-red-400 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pricing Metric Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="basePrice"
                  className="text-zinc-300 font-medium text-xs"
                >
                  Base Retail Price ($)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    placeholder="149.99"
                    {...register("basePrice")}
                    className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.basePrice && (
                  <p className="text-xs text-red-400 font-medium">
                    {errors.basePrice.message}
                  </p>
                )}
              </div>

              {/* SKU Serialization Identifier Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="sku"
                  className="text-zinc-300 font-medium text-xs"
                >
                  Tracking SKU Identifier
                </Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="sku"
                    type="text"
                    placeholder="KBD-ERG-01"
                    {...register("sku")}
                    className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.sku && (
                  <p className="text-xs text-red-400 font-medium">
                    {errors.sku.message}
                  </p>
                )}
              </div>

              {/* Initial Warehouse Stock Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="stock"
                  className="text-zinc-300 font-medium text-xs"
                >
                  Initial Inventory Stock
                </Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="stock"
                    type="number"
                    placeholder="50"
                    {...register("stock")}
                    className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.stock && (
                  <p className="text-xs text-red-400 font-medium">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            {/* Visual Image Link Asset Field */}
            <div className="space-y-2">
              <Label
                htmlFor="imageUrl"
                className="text-zinc-300 font-medium text-xs"
              >
                Visual Representation Image URL
              </Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="imageUrl"
                  type="text"
                  placeholder="https://images.unsplash.com/photo-example..."
                  {...register("imageUrl")}
                  className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200"
                  disabled={isLoading}
                />
              </div>
              {errors.imageUrl && (
                <p className="text-xs text-red-400 font-medium">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Form Transmission Activation Element */}
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium px-8 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-500/10 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  "Commit Inventory Listing"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
