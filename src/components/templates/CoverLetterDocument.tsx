import React from "react";
import { MasterProfile, CoverLetter, PageMargin } from "../../types";

interface Props {
  profile: MasterProfile;
  coverLetter: CoverLetter;
  fontSize?: "sm" | "base" | "lg";
  pageMargin?: PageMargin;
}

export const CoverLetterDocument: React.FC<Props> = ({
  profile,
  coverLetter,
  fontSize = "base",
  pageMargin = "normal",
}) => {
  const { personalInfo } = profile;

  const marginPadding = {
    compact: "p-8",
    normal: "p-12",
    spacious: "p-16",
  }[pageMargin];

  const config = {
    sm: {
      container: `${marginPadding} text-[12px]`,
      name: "text-[22px]",
      headline: "text-[12px]",
      bodyText: "text-[12px] leading-relaxed",
      headerPadding: "pb-4 mb-5",
    },
    base: {
      container: `${marginPadding} text-[13px]`,
      name: "text-[26px]",
      headline: "text-[13.5px]",
      bodyText: "text-[13px] leading-relaxed",
      headerPadding: "pb-5 mb-6",
    },
    lg: {
      container: `${marginPadding} text-[14px]`,
      name: "text-[28px]",
      headline: "text-[15px]",
      bodyText: "text-[14px] leading-loose",
      headerPadding: "pb-6 mb-7",
    },
  }[fontSize] || {
    container: `${marginPadding} text-[13px]`,
    name: "text-[26px]",
    headline: "text-[13.5px]",
    bodyText: "text-[13px] leading-relaxed",
    headerPadding: "pb-5 mb-6",
  };

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      id="cover-letter-document"
      className={`w-full h-full bg-white text-stone-900 ${config.container} font-sans leading-relaxed select-text flex flex-col justify-between`}
    >
      <div>
        {/* Sender Info */}
        <header
          data-page-break-block="true"
          className={`border-b border-stone-200 ${config.headerPadding}`}
        >
          <h1
            className={`${config.name} font-bold tracking-tight text-stone-950 uppercase font-display leading-tight`}
          >
            {personalInfo.fullName}
          </h1>
          {personalInfo.headline && (
            <p
              className={`${config.headline} font-medium text-stone-600 mt-0.5`}
            >
              {personalInfo.headline}
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 mt-2">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>{personalInfo.location}</span>
          </div>
        </header>

        {/* Date & Recipient */}
        <div data-page-break-block="true" className="mb-6 space-y-1 text-xs">
          <div className="text-stone-500 font-mono text-xs">{dateStr}</div>
          <div className="font-semibold text-stone-900 mt-3 text-sm">
            {coverLetter.recipientName || "Hiring Committee"}
          </div>
          <div className="text-stone-700">
            {coverLetter.recipientTitle || `${coverLetter.company} Team`}
          </div>
          <div className="text-stone-600 font-medium">
            {coverLetter.company}
          </div>
        </div>

        {/* Salutation */}
        <div
          data-page-break-block="true"
          className="font-semibold text-stone-900 mb-4 text-sm"
        >
          {coverLetter.salutation}
        </div>

        {/* Body Paragraphs */}
        <div
          className={`space-y-4 text-stone-800 text-justify ${config.bodyText}`}
        >
          {coverLetter.bodyParagraphs.map((para, idx) => (
            <p key={idx} data-page-break-block="true">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Sign-off */}
      <div
        data-page-break-block="true"
        className="mt-8 pt-4 border-t border-stone-100"
      >
        <div
          className={`whitespace-pre-line text-stone-900 font-medium ${config.bodyText}`}
        >
          {coverLetter.signOff || `Sincerely,\n${personalInfo.fullName}`}
        </div>
      </div>
    </div>
  );
};
