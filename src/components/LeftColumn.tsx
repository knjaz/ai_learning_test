import { useState } from "react";
import ShaderCanvas from "./ShaderCanvas";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

interface LeftColumnProps {
  onContactClick: () => void;
}

const fallbackText = {
  zh: "Карл Вигерс — признанный эксперт в области разработки требований к программному обеспечению. Книга 'Разработка требований к программному обеспечению' (Software Requirements, 3-е изд.) является одним из ключевых руководств в области бизнес-анализа и управления требованиями. Книга охватывает все аспекты работы с требованиями — от определений и основ до управления рисками и совершенствования процессов. Включает приёмы для традиционных и гибких (Agile) методологий разработки.",
  en: "Karl Wiegers is a recognized expert in software requirements development. His book 'Software Requirements' (3rd Edition) is one of the key guides in business analysis and requirements management. The book covers all aspects of requirements work — from definitions and fundamentals to risk management and process improvement. Includes practices for both traditional and agile development methodologies.",
};

export default function LeftColumn({ onContactClick }: LeftColumnProps) {
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const utils = trpc.useUtils();

  const { data: bio } = trpc.profile.get.useQuery();
  const updateBio = trpc.profile.update.useMutation({
    onSuccess: () => utils.profile.get.invalidate(),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editZh, setEditZh] = useState("");
  const [editEn, setEditEn] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editInstagram, setEditInstagram] = useState("");

  const profileText = {
    zh: bio?.zhText || fallbackText.zh,
    en: bio?.enText || fallbackText.en,
  };
  const email = bio?.email || "info@processimpact.com";
  const instagram = bio?.instagram || "https://processimpact.com";

  const startEdit = () => {
    setEditZh(profileText.zh);
    setEditEn(profileText.en);
    setEditEmail(email);
    setEditInstagram(instagram);
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateBio.mutate({ zhText: editZh, enText: editEn, email: editEmail, instagram: editInstagram });
    setIsEditing(false);
  };

  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "6px 8px",
    fontSize: "11px",
    color: "#FFFFFF",
    outline: "none" as const,
    resize: "vertical" as const,
    fontFamily: "'Space Mono', monospace",
  };

  const labelStyle = {
    fontSize: "10px",
    color: "rgba(255,255,255,0.6)",
    display: "block" as const,
    marginBottom: "4px",
  };

  return (
    <aside
      className="sticky top-0 h-screen flex flex-col"
      style={{
        width: "21%",
        minWidth: "240px",
        borderRight: "1px solid var(--border-light)",
        position: "relative",
      }}
    >
      <ShaderCanvas />

      <div
        className="relative z-10 flex flex-col h-full p-6"
        style={{ mixBlendMode: "difference" }}
      >
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2
              style={{
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                marginBottom: "16px",
                lineHeight: 1.4,
              }}
            >
              О КНИГЕ
            </h2>
            {isAdmin && !isEditing && (
              <button
                onClick={startEdit}
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.6)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Space Mono', monospace",
                  marginBottom: "16px",
                }}
              >
                EDIT
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <div>
                <label style={labelStyle}>EMAIL</label>
                <input
                  type="text"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>
              <div>
                <label style={labelStyle}>INSTAGRAM URL</label>
                <input
                  type="text"
                  value={editInstagram}
                  onChange={(e) => setEditInstagram(e.target.value)}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <a
                href={`mailto:${email}`}
                style={{
                  fontSize: "12px",
                  color: "#FFFFFF",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  display: "block",
                  lineHeight: 1.6,
                }}
              >
                {email}
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "12px",
                  color: "#FFFFFF",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  display: "block",
                  lineHeight: 1.6,
                }}
              >
                Process Impact
              </a>
            </div>
          )}
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label style={labelStyle}>ZH</label>
                <textarea
                  value={editZh}
                  onChange={(e) => setEditZh(e.target.value)}
                  rows={8}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>EN</label>
                <textarea
                  value={editEn}
                  onChange={(e) => setEditEn(e.target.value)}
                  rows={8}
                  style={inputStyle}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  style={{
                    fontSize: "10px",
                    color: "#1A1A1A",
                    background: "#FFFFFF",
                    border: "none",
                    padding: "4px 12px",
                    cursor: "pointer",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  SAVE
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    fontSize: "10px",
                    color: "#FFFFFF",
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    padding: "4px 12px",
                    cursor: "pointer",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <p
              style={{
                fontSize: "12px",
                lineHeight: 1.8,
                color: "#FFFFFF",
                maxWidth: "240px",
                textAlign: "justify",
              }}
            >
              {profileText[language]}
            </p>
          )}
        </div>

        <div className="mt-auto" style={{ flexShrink: 0, paddingBottom: "24px" }}>
          <button
            onClick={onContactClick}
            style={{
              fontSize: "12px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.opacity = "0.6";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.opacity = "1";
            }}
          >
          СВЯЗАТЬСЯ
          </button>
        </div>
      </div>
    </aside>
  );
}
