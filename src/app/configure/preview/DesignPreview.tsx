/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Confetti from 'react-dom-confetti';
import { ArrowRight, Check } from 'lucide-react';
import { createCheckoutSession } from './actions'
import Phone from '@/components/elements/Phone';
import { Button } from '@/components/ui/button';
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products';
import { getOptionLabel } from '@/validators/option-validator';
import { cn, formatPrice } from '@/lib/utils';
import LoginModal from '@/components/elements/LoginModal';
import { toast } from '@/components/use-toast';

// Interface for the plain configuration object
interface PlainConfiguration {
  id: string;
  width: number;
  height: number;
  imageUrl: string;
  color?: string;
  phoneModel?: string;
  material?: string;
  finish?: string;
  croppedImageUrl?: string;
  orders: string[];
  createdAt: string;
  updatedAt: string;
}

interface DesignPreviewProps {
  configuration: PlainConfiguration;
}

const DesignPreview = ({ configuration }: DesignPreviewProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false)

  useEffect(() => setShowConfetti(true), []);
  
  const { id, color, phoneModel, finish, material, croppedImageUrl } = configuration;

  const tw = getOptionLabel('color', color); // Uses tw value from COLORS
  const modelLabel = getOptionLabel('model', phoneModel);

  let totalPrice = BASE_PRICE;
  if (material === 'polycarbonate') totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === 'textured') totalPrice += PRODUCT_PRICES.finish.textured;

  const handleCheckout = async () => {
    if (!session?.user) {
      localStorage.setItem('configurationId', id);
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const { url } = await createCheckoutSession({ configId: id });
      console.log(url)
      if (url) {
        router.push(url)
      } else {
        throw new Error('Unable to retrieve payment URL.')
      }
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Unable to proceed to checkout. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 flex justify-center select-none overflow-hidden"
        aria-hidden="true"
      >
        <Confetti active={showConfetti} config={{ elementCount: 200, spread: 90 }} />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2">
          <Phone className={cn(`bg-${tw}`, 'max-w-[150px] md:max-w-full')} imgSrc={croppedImageUrl || ''} />
        </div>

        <div className="mt-6 sm:col-span-9 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock and ready to ship
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, durable material</li>
                <li>Scratch- and fingerprint-resistant coating</li>
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Base price</span>
                  <span className="font-medium text-gray-900">{formatPrice(BASE_PRICE / 100)}</span>
                </div>
                {finish === 'textured' && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Textured finish</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </span>
                  </div>
                )}
                {material === 'polycarbonate' && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Soft polycarbonate</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </span>
                  </div>
                )}
                <div className="my-2 h-px bg-gray-200" />
                <div className="flex justify-between font-semibold py-2">
                  <span>Order total</span>
                  <span>{formatPrice(totalPrice / 100)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button onClick={handleCheckout} className="px-4 sm:px-6 lg:px-8">
                Check out <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;