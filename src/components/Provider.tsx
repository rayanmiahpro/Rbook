import { ImageKitProvider } from "@imagekit/next";

export default function UploadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ImageKitProvider
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
    >
      {children}
    </ImageKitProvider>
  );
}
