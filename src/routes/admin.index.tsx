import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Building2, BookOpen, Mail, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({
    propsTotal: 0,
    propsPub: 0,
    articles: 0,
    newEnquiries: 0,
  });

  useEffect(() => {
    (async () => {
      const [props, propsPub, articles, enq] = await Promise.all([
        supabase.from("properties").select("id", { count: "exact", head: true }),
        supabase.from("properties").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("guide_articles").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setStats({
        propsTotal: props.count ?? 0,
        propsPub: propsPub.count ?? 0,
        articles: articles.count ?? 0,
        newEnquiries: enq.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    {
      to: "/admin/properties",
      icon: Building2,
      label: "Properties",
      value: `${stats.propsPub} / ${stats.propsTotal}`,
      sub: "published / total",
    },
    {
      to: "/admin/guide-articles",
      icon: BookOpen,
      label: "Guide Articles",
      value: String(stats.articles),
      sub: "total",
    },
    {
      to: "/admin/enquiries",
      icon: Mail,
      label: "New Enquiries",
      value: String(stats.newEnquiries),
      sub: "awaiting reply",
    },
  ];

  return (
    <>
      <AdminPageHeader title="Welcome." description="A quick view of what's happening." />
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group bg-white border border-mist p-6 rounded hover:border-ocean transition-colors"
          >
            <div className="flex items-start justify-between">
              <c.icon className="w-5 h-5 text-warmth" />
              <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-ocean transition-colors" />
            </div>
            <p className="smallcaps text-ink/60 mt-6">{c.label}</p>
            <p className="font-display text-5xl font-light mt-2">{c.value}</p>
            <p className="text-xs text-ink/50 mt-1">{c.sub}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
