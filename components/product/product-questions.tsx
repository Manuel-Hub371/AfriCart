"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, ThumbsUp, Send, Store, CheckCircle2, Loader2, MessageSquarePlus } from "lucide-react";

interface Question {
  id: string;
  customerName: string;
  question: string;
  answer: string | null;
  answeredAt: string | null;
  helpfulVotes: number;
  createdAt: string;
}

interface ProductQuestionsProps {
  productId: string;
  initialQuestions?: Question[];
  storeName?: string;
}

export function ProductQuestions({ productId, initialQuestions = [], storeName = "Merchant" }: ProductQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [newQuestionText, setNewQuestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!productId) return;
    async function loadQuestions() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${productId}/questions`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions || []);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, [productId]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const res = await fetch(`/api/products/${productId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestionText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit question");
      }

      setSubmitSuccess("Question submitted successfully!");
      setNewQuestionText("");
      setShowForm(false);
      setQuestions((prev) => [data.question, ...prev]);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpfulVote = (qId: string) => {
    if (votedMap[qId]) return;
    setVotedMap((prev) => ({ ...prev, [qId]: true }));
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, helpfulVotes: q.helpfulVotes + 1 } : q))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-600" />
            Customer Questions &amp; Answers
          </h3>
          <p className="text-xs text-gray-600 font-medium">
            Have a question about this product? Ask the merchant directly or view answered questions.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl"
        >
          <MessageSquarePlus className="h-4 w-4" />
          {showForm ? "Cancel" : "Ask a Question"}
        </Button>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          {submitSuccess}
        </div>
      )}

      {showForm && (
        <Card className="p-6 border border-emerald-200 bg-white shadow-md rounded-2xl">
          <h4 className="text-base font-bold text-gray-900 mb-2">Submit Your Question</h4>
          {submitError && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="What would you like to know about specifications, sizing, or compatibility?"
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Post Question
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-gray-500 text-sm">Loading questions...</div>
      ) : questions.length === 0 ? (
        <Card className="p-8 text-center text-gray-500 rounded-2xl border-dashed">
          No questions asked yet for this product. Be the first to ask!
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const formattedQDate = q.createdAt
              ? new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "";
            const formattedADate = q.answeredAt
              ? new Date(q.answeredAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "";

            return (
              <Card key={q.id} className="p-6 rounded-2xl border border-gray-200 space-y-4 hover:shadow-sm transition-shadow">
                {/* Question Row */}
                <div className="flex items-start gap-3">
                  <span className="font-extrabold text-emerald-700 text-base bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    Q:
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{q.question}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Asked by <span className="font-semibold text-gray-700">{q.customerName}</span> on {formattedQDate}
                    </p>
                  </div>
                </div>

                {/* Answer Row */}
                {q.answer ? (
                  <div className="flex items-start gap-3 pl-4 border-l-2 border-emerald-500 bg-gray-50/70 p-3.5 rounded-r-xl">
                    <Store className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-800 uppercase">{storeName} (Seller)</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[10px] text-gray-400">{formattedADate}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">{q.answer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="pl-4 border-l-2 border-amber-300 text-xs text-amber-700 italic bg-amber-50/50 p-2.5 rounded-r-xl">
                    Awaiting response from {storeName}...
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center justify-end text-xs gap-3 pt-2 border-t text-gray-500">
                  <span>Is this helpful?</span>
                  <button
                    onClick={() => handleHelpfulVote(q.id)}
                    disabled={votedMap[q.id]}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                      votedMap[q.id]
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"
                        : "hover:bg-gray-100 border-gray-200"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Helpful ({q.helpfulVotes})
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
