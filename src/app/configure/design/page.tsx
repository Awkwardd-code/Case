/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectDB } from '@/config/connectDb';
import { notFound } from 'next/navigation';
import DesignConfigurator from './DesignConfigurator';
import Configuration from '@/models/configurationSchema';

// Define the configuration type (based on database schema)
interface Configuration {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
}

// Define props for DesignConfigurator
interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: {
    width: number;
    height: number;
  };
}

// Define the shape of resolved searchParams
interface SearchParams {
  id?: string;
  [key: string]: string | string[] | undefined;
}

// Define page props with searchParams as a Promise
interface PageProps {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: PageProps) => {
  // Resolve the searchParams Promise
  const resolvedSearchParams = await searchParams;
  const { id } = resolvedSearchParams;
  console.log(id)
  // If id is missing, return 404
  if (!id) {
    return notFound();
  }

  await connectDB();

 const configuration = await Configuration.findOne({ _id: id });


  // If configuration is not found, return 404
  if (!configuration) {
    return notFound();
  }

  const { imageUrl, width, height } = configuration as Configuration;

  return (
    <DesignConfigurator
      configId={id}
      imageUrl={imageUrl}
      imageDimensions={{ width, height }}
    />
  );
};

export default Page;