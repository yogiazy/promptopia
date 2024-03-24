"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, Suspense } from "next/navigation"; // Import Suspense from next/navigation

import Form from "@components/Form";

const UpdatePrompt = () => {
  const router = useRouter();
  const promptId = useSearchParams().get("id");

  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getPromptDetails = async () => {
      if (!promptId) return; // Tambahkan penanganan jika promptId tidak ada
  
      try {
        const response = await fetch(`/api/prompt/${promptId}`);
        const data = await response.json();
  
        setPost({
          prompt: data.prompt,
          tag: data.tag,
        });
      } catch (error) {
        console.error("Error fetching prompt details:", error);
      }
    };
  
    getPromptDetails(); // Panggil fungsi di dalam useEffect langsung
  }, [promptId]);
  

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!promptId) return alert("Missing PromptId!");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Wrap in Suspense boundary */}
      <Form
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={updatePrompt}
      />
    </Suspense>
  );
};

export default UpdatePrompt;