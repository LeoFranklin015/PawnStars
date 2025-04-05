"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PinataSDK } from "pinata-web3";
import { publicClient, walletClient } from "@/lib/client";
import { ISSUER_ABI, ISSUER_CONTRACT_ADDRESS } from "@/lib/const";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

export default function CreateRWA() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ownershipProof, setOwnershipProof] = useState<File | null>(null);
  const [pinata, setPinata] = useState<PinataSDK | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [productName, setProductName] = useState<string | null>(null);
  const [yearsOfUsage, setYearsOfUsage] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  const { address } = useAccount();

  // init Pinata
  useEffect(() => {
    const initPinata = async () => {
      try {
        const { PinataSDK } = await import("pinata-web3");
        setPinata(
          new PinataSDK({
            pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
            pinataGateway: "orange-select-opossum-767.mypinata.cloud",
          })
        );
      } catch (error) {
        console.error("Failed to initialize Pinata:", error);
      }
    };
    initPinata();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToPinata = async (file: File) => {
    try {
      setIsUploading(true);
      if (!file || !pinata) {
        throw new Error("No image file selected or Pinata not initialized");
      }
      const response = await pinata.upload.file(file);
      console.log("Image uploaded to Pinata: ", response);
      return response.IpfsHash;
    } catch (error) {
      console.error("Error uploading image to Pinata: ", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOwnershipProof(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!pinata) {
      console.error("File upload service not initialized");
      return;
    }

    if (!imageFile) {
      console.error("No image file selected");
      return;
    }

    if (!ownershipProof) {
      console.error("No proof of ownership file selected");
      return;
    }

    console.log("Uploading Image to Pinata...");
    const imageHash = await uploadImageToPinata(imageFile);
    console.log("Image uploaded to Pinata: ", imageHash);

    console.log("Uploading Proof of Ownership to Pinata...");
    const proofHash = await uploadImageToPinata(ownershipProof);
    console.log("Proof of Ownership uploaded to Pinata: ", proofHash);

    const yearsOfUsageBigInt = ethers.toBigInt(yearsOfUsage!);

    console.log("Years of Usage: ", yearsOfUsageBigInt);
    console.log("Product Name: ", productName);
    console.log("Image Hash: ", imageHash);
    console.log("Proof Hash: ", proofHash);

    // Write to contract
    const tx = await walletClient?.writeContract({
      account: address as `0x${string}`,
      address: ISSUER_CONTRACT_ADDRESS,
      abi: ISSUER_ABI,
      functionName: "requestRWA",
      args: [productName, imageHash, ethers.toBigInt(yearsOfUsage!), proofHash],
    });

    await publicClient.waitForTransactionReceipt({
      hash: tx as `0x${string}`,
    });

    console.log("Transaction sent: ", tx);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen py-12 px-4 dotted-background">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1
            className="text-4xl font-black"
            style={{ textShadow: "3px 3px 0px #FFD700" }}
          >
            CREATE NEW RWA
          </h1>
          <p className="mt-2 text-gray-600">
            Convert your real-world asset into a tokenized on-chain asset
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            className="bg-white p-8 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 border-4 border-green-500 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                RWA Created Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your asset has been successfully tokenized and added to your
                portfolio.
              </p>
              <Button onClick={() => router.push("/my-rwas")}>
                View My RWAs
              </Button>
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]"
          >
            <div className="space-y-6">
              <div>
                <Label htmlFor="productName" className="text-base font-bold">
                  Product Name
                </Label>
                <Input
                  id="productName"
                  name="productName"
                  placeholder="e.g. Vintage Watch, Luxury Handbag"
                  className="mt-1"
                  required
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="yearsOfUsage" className="text-base font-bold">
                  Years of Usage
                </Label>
                <Input
                  id="yearsOfUsage"
                  name="yearsOfUsage"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 2.5"
                  className="mt-1"
                  required
                  onChange={(e) => setYearsOfUsage(Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-bold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your asset in detail including condition, brand, model, etc."
                  className="mt-1 h-24"
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-base font-bold">Product Image</Label>
                <div className="mt-1 border-4 border-black bg-pink-200 p-6 rounded-lg">
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="productImage"
                    className="w-full cursor-pointer block text-center"
                  >
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Product preview"
                          className="max-h-48 max-w-full object-contain mb-4"
                        />
                        <span className="text-sm font-bold">Change image</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 mb-2" />
                        <p className="font-bold">
                          Drag and drop an image, or click to browse
                        </p>
                        <p className="text-sm mt-1">
                          Supports JPG, PNG, WebP, GIF (max 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <Label className="text-base font-bold">
                  Proof of Ownership
                </Label>
                <div className="mt-1 border-4 border-black bg-blue-200 p-6 rounded-lg">
                  <input
                    type="file"
                    id="ownershipProof"
                    accept=".pdf,.doc,.docx"
                    onChange={handleProofUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="ownershipProof"
                    className="w-full cursor-pointer block text-center"
                  >
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 mb-2" />
                      <p className="font-bold">
                        Upload proof of ownership document
                      </p>
                      <p className="text-sm mt-1">PDF, DOC up to 10MB</p>
                      {ownershipProof && (
                        <div className="mt-2 flex items-center text-sm text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {ownershipProof.name}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                      Processing...
                    </>
                  ) : (
                    "Create RWA"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  asChild
                >
                  <Link href="/my-rwas">Cancel</Link>
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
