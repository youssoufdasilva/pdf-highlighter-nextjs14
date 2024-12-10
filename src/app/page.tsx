"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
// import PdfViewer from "@/components/pdf-viewer/PdfViewer";
import dynamic from "next/dynamic";
const PdfViewer = dynamic(() => import("@/components/pdf-viewer/PdfViewer"), {
  ssr: false,
});

import { GhostHighlight } from "react-pdf-highlighter-extended";
import { useSearchParams } from "next/navigation";

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021";

export default function Home() {
  const searchParams = useSearchParams();
  // const searchParams = new URLSearchParams(document.location.search);

  const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

  const [url, setUrl] = useState(initialUrl);

  const addNewHighlight = (highlight: GhostHighlight) => {
    console.log("New highlight added :: ", highlight);
    // Here you can add any additional logic for handling the new highlight
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex" style={{ height: "100vh" }}>
      <div className="flex flex-col p-4 gap-8 bg-neutral-900">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* Upload PDF */}
        <form className="flex flex-col p-4 bg-blue-900 gap-4">
          <label
            htmlFor="pdf-upload"
            className="text-sm text-center p-2 rounded-md cursor-pointer bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700"
          >
            Upload PDF
          </label>
          <input
            type="file"
            id="pdf-upload"
            className="hidden"
            accept=".pdf"
            onChange={(e) => {
              const pdf = e.target.files?.[0];
              if (pdf) {
                const url = URL.createObjectURL(pdf);
                console.log("new pdf url :: ", url);
                setUrl(url);
              }
            }}
          />

          <button
            type="button"
            className="text-sm text-center p-2 rounded-md cursor-pointer bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700"
            onClick={() => {
              const highlighter = document.querySelector(".PdfHighlighter");
              if (
                highlighter &&
                (highlighter as any)._utils?.createCenteredHighlight
              ) {
                (highlighter as any)._utils.createCenteredHighlight();
              }
            }}
          >
            Add Center Highlight
          </button>
        </form>
      </div>

      {url && <PdfViewer url={url} addNewHighlight={addNewHighlight} />}
    </div>
  );
}
