"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  FileText,
  Star,
  Trash2,
  Flag,
  ArrowLeft,
  Reply,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock email data matching the image
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

const MailPage = () => {
  const [selectedFolder, setSelectedFolder] = useState("Inbox");
  const [selectedLabel, setSelectedLabel] = useState("Work");
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<
    (typeof mockEmails)[0] | null
  >(null);
  const router = useRouter();

  const toggleStar = (id: number) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, isStarred: !email.isStarred } : email
      )
    );
  };

  const getColorDot = (color: string | null) => {
    if (!color) return null;
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
    };
    return (
      <div className={`w-2 h-2 rounded-full ${colorMap[color] || ""} ml-2`} />
    );
  };

  const folders = [
    { name: "Inbox", icon: Mail },
    { name: "Sent Item", icon: Send },
    { name: "Draft", icon: FileText },
    { name: "Starred", icon: Star },
    { name: "Deleted", icon: Trash2 },
  ];

  const labels = [
    { name: "Work", color: "red" },
    { name: "Private", color: "blue" },
    { name: "Important", color: "purple" },
  ];

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Mailbox</h1>
        <Button className="flex items-center gap-2 bg-[#518fff] hover:bg-[#4078e0] text-white">
          <Mail className="w-4 h-4" />
          New email
        </Button>
      </div>

      {/* Left Panel: Mailbox Categories and Labels */}

      {/* Right Panel: Email List or Email Detail */}
      <div className=" bg-white max-w-5xl mx-auto rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    FROM
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SUBJECT
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    RECEIVED
                  </span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ACTION
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {emails.map((email) => (
                // <Link></Link>
                <tr
                  key={email.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td
                    className="px-6 py-4"
                    onClick={() =>
                      router.push(`/admin/dashboard/mail/${email.id}`)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <Image
                          src={`/api/placeholder/40/40`}
                          alt={email.from}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">
                          {email.from}
                        </span>
                        {getColorDot(email.color)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 truncate max-w-md">
                      {email.subject}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{email.received}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 text-gray-600 hover:text-[#518fff] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Flag"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(email.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          email.isStarred
                            ? "text-yellow-500 hover:bg-gray-100"
                            : "text-gray-600 hover:text-yellow-500 hover:bg-gray-100"
                        }`}
                        title="Star"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            email.isStarred ? "fill-current" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MailPage;
