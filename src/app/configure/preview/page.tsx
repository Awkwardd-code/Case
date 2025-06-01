// src/app/configure/preview/page.tsx
import { connectDB } from '@/config/connectDb';
import { notFound } from 'next/navigation';
import DesignPreview from './DesignPreview';
import Configuration from '@/models/configurationSchema';
import mongoose from 'mongoose';

interface PageProps {
  searchParams: Promise<{
    id?: string | string[];
    [key: string]: string | string[] | undefined;
  }>;
}

const Loading = () => {
  return <div>Loading...</div>;
};

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  console.log('resolvedSearchParams:', resolvedSearchParams);

  let id = resolvedSearchParams.id;
  console.log('id:', id, 'type:', typeof id);

  if (id === undefined) {
    return <Loading />;
  }

  if (Array.isArray(id)) {
    id = id[0];
    console.log('id was an array, using first value:', id);
  }

  if (!id || typeof id !== 'string') {
    console.log('Invalid id:', id);
    return notFound();
  }

  try {
    await connectDB();
    console.log('Database connected');

    const configuration = await Configuration.findOne({ _id: id });
    console.log('Configuration found:', configuration);

    if (!configuration) {
      console.log('No configuration found for id:', id);
      return notFound();
    }

    const plainConfiguration = {
      id: configuration._id.toString(),
      width: configuration.width,
      height: configuration.height,
      imageUrl: configuration.imageUrl,
      color: configuration.color,
      phoneModel: configuration.phoneModel,
      material: configuration.material,
      finish: configuration.finish,
      croppedImageUrl: configuration.croppedImageUrl,
      orders: configuration.orders.map((order: mongoose.Types.ObjectId) => order.toString()) || [],
      createdAt: configuration.createdAt.toISOString(),
      updatedAt: configuration.updatedAt.toISOString(),
    };

    console.log('plainConfiguration:', plainConfiguration);
    return <DesignPreview configuration={plainConfiguration} />;
  } catch (error) {
    console.error('Error during database operation:', error);
    return notFound();
  }
};

export default Page;