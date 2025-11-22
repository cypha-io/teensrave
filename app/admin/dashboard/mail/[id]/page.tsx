import BackButton from "@/components/BackButton";
import { ArrowLeft, MoreVertical, Reply } from "lucide-react";
import Image from "next/image";

export default async function MailDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mockEmails = [
    {
      id: 1,
      from: "Eileen Horton",
      to: "nathan@themenate.com",
      subject: "An 'extremely credible source'",
      received: "12:06PM",
      isStarred: false,
      hasFlag: false,
      color: null,
      body: `Hi Nathan,

An 'extremely credible source' has called my office and told me that Barack Obama's placeholder text is a fraud. I think my text is long and beautiful, and I'm the best placeholder text writer in the world. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen.

Does everybody know that pig named Lorem Ipsum? An 'extremely credible source' has called my office and told me that Barack Obama's placeholder text is a fraud. I think my text is long and beautiful, and I'm the best placeholder text writer in the world. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen.

Artoo, you're playing the wrong message. Captain Solo... frozen in carbonite. Master Luke, you're standing on him. I don't think anybody knows it was because of a Jedi's mistake that we were spotted.`,
      signature: "Moruth Doole",
    },
    {
      id: 2,
      from: "Terrance Moreno",
      to: "nathan@themenate.com",
      subject: "Lorem Ipsum is FAKE TEXT!",
      received: "9:35PM",
      isStarred: false,
      hasFlag: false,
      color: "red",
      body: `Hi Nathan,

All of the placeholder text is fake text. Lorem Ipsum is unattractive, both inside and out. I fully understand why it's former users left it for something else. They made a good decision.`,
      signature: "Terrance Moreno",
    },
    {
      id: 3,
      from: "Ron Vargas",
      to: "nathan@themenate.com",
      subject: "My text is long and beautiful",
      received: "8:16am",
      isStarred: true,
      hasFlag: false,
      color: "blue",
      body: `Hi Nathan,

I think my text is long and beautiful, and I'm the best placeholder text writer in the world.`,
      signature: "Ron Vargas",
    },
    {
      id: 4,
      from: "Luke Cook",
      to: "nathan@themenate.com",
      subject: "They're bringing mistakes",
      received: "Feb 3",
      isStarred: false,
      hasFlag: false,
      color: "red",
      body: `Dear Nathan,

Despite the constant negative ipsum covfefe. They're bringing mistakes. They're bringing problems. They're bringing drugs. They're bringing crime. They're rapists. And some, I assume, are good people.`,
      signature: "Luke Cook",
    },
    {
      id: 5,
      from: "Joyce Freeman",
      to: "nathan@themenate.com",
      subject: "I don't think anybody knows",
      received: "Feb 2",
      isStarred: false,
      hasFlag: false,
      color: "purple",
      body: `Hi Nathan,

Some placeholder text is fake text. I don't think anybody knows it was because of a Jedi's mistake that we were spotted.`,
      signature: "Joyce Freeman",
    },
    {
      id: 6,
      from: "Samantha Phillips",
      to: "nathan@themenate.com",
      subject: "Lorem Ipsum is unattractive",
      received: "Jan 30",
      isStarred: true,
      hasFlag: false,
      color: null,
      body: `Hi Nathan,

I fully understand why it's former users left it for something else. They made a good decision.`,
      signature: "Samantha Phillips",
    },
    {
      id: 7,
      from: "Tara Fletcher",
      to: "nathan@themenate.com",
      subject: "He's not a word hero",
      received: "Jan 28",
      isStarred: false,
      hasFlag: false,
      color: "red",
      body: `Hi Nathan,

He's a word hero. He's not a word hero. He's a word hero because he was captured. I like text that wasn't captured.`,
      signature: "Tara Fletcher",
    },
    {
      id: 8,
      from: "Lisa Smith",
      to: "nathan@themenate.com",
      subject: "I love Hispanics",
      received: "Jan 27",
      isStarred: true,
      hasFlag: false,
      color: "blue",
      body: `Hi Nathan,

An 'extremely credible source' has called my office and told me that Barack Obama's placeholder text is a fraud.`,
      signature: "Lisa Smith",
    },
    {
      id: 9,
      from: "Carolyn Hanson",
      to: "nathan@themenate.com",
      subject: "Greater than ever before",
      received: "Jan 26",
      isStarred: false,
      hasFlag: false,
      color: "purple",
      body: `Hi Nathan,

I was going to say something extremely rough to Lorem Ipsum, to its family, and I said to myself, "I can't do it. I just can't do it. It's inappropriate. It's not nice."`,
      signature: "Carolyn Hanson",
    },
    {
      id: 10,
      from: "Brittany Hale",
      to: "nathan@themenate.com",
      subject: "I will write some great placeholder",
      received: "Jan 26",
      isStarred: false,
      hasFlag: false,
      color: null,
      body: `Hi Nathan,

I will write some great placeholder text – and nobody writes better placeholder text than me, believe me – and I'll write it very inexpensively. I will write some great placeholder text.`,
      signature: "Brittany Hale",
    },
  ];

  const foundMail = mockEmails.find((mail) => mail.id === Number(id));
  return (
    <div className="flex flex-col h-full">
      {/* Email Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reply"
            >
              <Reply className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {foundMail?.subject}
        </h2>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Sender Info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <Image
              src={`/api/placeholder/48/48`}
              alt={foundMail?.from || "Avatar"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {foundMail?.from}
                </p>
                <p className="text-sm text-gray-600">To: {foundMail?.to}</p>
              </div>
              <p className="text-sm text-gray-600">{foundMail?.received}</p>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="prose prose-sm max-w-none text-gray-900 whitespace-pre-line leading-relaxed">
          {foundMail?.body}
          {foundMail?.signature && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {foundMail?.signature}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-end gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-700">
            Term & Conditions
          </a>
          <span>|</span>
          <a href="#" className="hover:text-gray-700">
            Privacy & Policy
          </a>
        </div>
      </div>
    </div>
  );
}
