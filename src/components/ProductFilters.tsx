
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Filter, X, Check, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

export interface ProductFiltersState {
  search: string;
  manufacturer: string[];
  productType: string[];
  featured: boolean;
  premium: boolean;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  sortBy: string;
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onFilterChange: (filters: ProductFiltersState) => void;
  onReset: () => void;
  manufacturers: Array<{ id: string; name: string }>;
  productTypes: Array<{ id: string; name: string }>;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  manufacturers,
  productTypes
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };
  
  const handleManufacturerChange = (manufacturerId: string) => {
    const newManufacturers = filters.manufacturer.includes(manufacturerId)
      ? filters.manufacturer.filter(id => id !== manufacturerId)
      : [...filters.manufacturer, manufacturerId];
    
    onFilterChange({ ...filters, manufacturer: newManufacturers });
  };
  
  const handleProductTypeChange = (typeId: string) => {
    const newProductTypes = filters.productType.includes(typeId)
      ? filters.productType.filter(id => id !== typeId)
      : [...filters.productType, typeId];
    
    onFilterChange({ ...filters, productType: newProductTypes });
  };
  
  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: numValue
      }
    });
  };
  
  const handleSortChange = (value: string) => {
    onFilterChange({ ...filters, sortBy: value });
  };
  
  const handleFeaturedChange = (checked: boolean) => {
    onFilterChange({ ...filters, featured: checked });
  };
  
  const handlePremiumChange = (checked: boolean) => {
    onFilterChange({ ...filters, premium: checked });
  };
  
  const hasActiveFilters = (): boolean => {
    return (
      filters.search.trim() !== '' ||
      filters.manufacturer.length > 0 ||
      filters.productType.length > 0 ||
      filters.featured ||
      filters.premium ||
      filters.priceRange.min !== null ||
      filters.priceRange.max !== null
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
        <div className="relative w-full md:max-w-sm">
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name_asc">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="h-4 w-4" />
                    <span>Name (A-Z)</span>
                  </div>
                </SelectItem>
                <SelectItem value="name_desc">
                  <div className="flex items-center gap-2">
                    <ArrowUpAZ className="h-4 w-4" />
                    <span>Name (Z-A)</span>
                  </div>
                </SelectItem>
                <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsOpen(!isOpen)}
            className="flex lg:hidden"
            aria-label="Toggle filters"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className={`grid md:grid-cols-[250px_1fr] gap-4 transition-all ${isOpen ? 'block' : 'hidden md:grid'}`}>
        <div className="space-y-4 bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filters
            </h3>
            
            {hasActiveFilters() && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReset}
                className="h-8 text-sm text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
          
          <Separator />
          
          <Accordion type="multiple" defaultValue={['price', 'type', 'manufacturer', 'other']}>
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="min-price">Min ($)</Label>
                    <Input
                      id="min-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Min"
                      value={filters.priceRange.min !== null ? filters.priceRange.min : ''}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="max-price">Max ($)</Label>
                    <Input
                      id="max-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Max"
                      value={filters.priceRange.max !== null ? filters.priceRange.max : ''}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="type">
              <AccordionTrigger>Product Type</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {productTypes.map(type => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type.id}`} 
                        checked={filters.productType.includes(type.id)}
                        onCheckedChange={(checked) => {
                          if (checked) handleProductTypeChange(type.id);
                          else handleProductTypeChange(type.id);
                        }}
                      />
                      <Label 
                        htmlFor={`type-${type.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {type.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="manufacturer">
              <AccordionTrigger>Manufacturer</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {manufacturers.map(manufacturer => (
                    <div key={manufacturer.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`manufacturer-${manufacturer.id}`} 
                        checked={filters.manufacturer.includes(manufacturer.id)}
                        onCheckedChange={(checked) => {
                          if (checked) handleManufacturerChange(manufacturer.id);
                          else handleManufacturerChange(manufacturer.id);
                        }}
                      />
                      <Label 
                        htmlFor={`manufacturer-${manufacturer.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {manufacturer.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="other">
              <AccordionTrigger>Other Filters</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="featured" 
                      checked={filters.featured}
                      onCheckedChange={(checked) => 
                        handleFeaturedChange(checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor="featured"
                      className="text-sm cursor-pointer"
                    >
                      Featured Products
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="premium" 
                      checked={filters.premium}
                      onCheckedChange={(checked) => 
                        handlePremiumChange(checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor="premium"
                      className="text-sm cursor-pointer"
                    >
                      Premium Products
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* This is just a placeholder to show the grid layout - the actual product list will be rendered separately */}
        <div className="hidden">Products List Goes Here</div>
      </div>
    </div>
  );
};
