import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Variety } from "@/data/products";

interface Props {
  varieties: Variety[];
  categoryName?: string;
}

export default function PDFCatalogDownload({ varieties, categoryName }: Props) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = () => {
    setGenerating(true);

    // Build printable HTML
    const rows = varieties.map(v => `
      <tr>
        <td>${v.name}</td>
        <td>${v.cropName}</td>
        <td>${v.company}</td>
        <td>${v.durationDays} days</td>
        <td>₹${v.priceExFactory.toFixed(2)}</td>
        <td>₹${v.price15k.toFixed(2)}</td>
        <td>₹${v.price30k.toFixed(2)}</td>
        <td>${v.minOrderQty.toLocaleString()}</td>
        <td>${v.stock > 0 ? "In Stock" : "Out of Stock"}</td>
      </tr>
    `).join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Sanap Hi-Tech Nursery — Product Catalog</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a1a; padding: 20px; }
          .header { text-align: center; margin-bottom: 24px; border-bottom: 3px solid #2d7a3a; padding-bottom: 16px; }
          .header h1 { font-size: 22px; color: #2d7a3a; font-weight: 900; letter-spacing: 1px; }
          .header p { color: #666; margin-top: 4px; font-size: 12px; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 10px; color: #888; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #2d7a3a; color: white; padding: 8px 6px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
          td { padding: 7px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
          tr:nth-child(even) td { background: #f9fdf9; }
          .footer { margin-top: 24px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 12px; }
          .badge-stock { color: #2d7a3a; font-weight: bold; }
          .badge-out { color: #c0392b; }
          @media print {
            body { padding: 10px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌱 Sanap Hi-Tech Nursery (I) Pvt. Ltd.</h1>
          <p>Tal. Dindori, Dist. Nashik — 422 004, Maharashtra, India</p>
          <p>📞 +91 74477 70803 &nbsp;|&nbsp; ✉ sanaphitechnursery@gmail.com</p>
        </div>
        <div class="meta">
          <span><strong>Catalog:</strong> ${categoryName || "All Varieties"}</span>
          <span><strong>Generated:</strong> ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span><strong>Total Varieties:</strong> ${varieties.length}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Variety</th><th>Crop</th><th>Company</th><th>Ready In</th>
              <th>Ex-Factory</th><th>15K+ Rate</th><th>30K+ Rate</th>
              <th>Min Order</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="footer">
          <p>Prices are per plant (₹). Minimum order: 1,000 plants. Bulk discounts apply at 15,000+ and 30,000+ plants.</p>
          <p style="margin-top:6px">© ${new Date().getFullYear()} Sanap Hi-Tech Nursery (I) Pvt. Ltd. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => {
        win.print();
        setGenerating(false);
      }, 500);
    } else {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-cta text-primary-foreground font-semibold text-sm hover:shadow-elevated transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {generating ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
      ) : (
        <><FileText className="w-4 h-4" /> Download Catalog PDF</>
      )}
    </button>
  );
}
