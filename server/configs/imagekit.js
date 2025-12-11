// import ImageKit from "imagekit";



// var imagekit = new ImageKit({
//     publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
//     privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
//     urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
// });

// export default imagekit;

// configs/imagekit.js
import ImageKit from "imagekit";

const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } =
  process.env;

if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
  console.error(
    "Missing ImageKit environment variables. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT"
  );
  // Depending on preference, exit or allow starting (I recommend failing fast)
  process.exit(1);
}

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY, // keep server-side only
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
