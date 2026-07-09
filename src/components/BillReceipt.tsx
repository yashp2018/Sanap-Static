import { useRef } from "react";
import { Printer, Download } from "lucide-react";
import logoImg from "@/assets/S-LOGO.png";

function toWords(n: number): string {
  if (n === 0) return "Zero";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const convert = (num: number): string => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? " "+ones[num%10] : "");
    if (num < 1000) return ones[Math.floor(num/100)]+" Hundred"+(num%100 ? " "+convert(num%100) : "");
    if (num < 100000) return convert(Math.floor(num/1000))+" Thousand"+(num%1000 ? " "+convert(num%1000) : "");
    if (num < 10000000) return convert(Math.floor(num/100000))+" Lakh"+(num%100000 ? " "+convert(num%100000) : "");
    return convert(Math.floor(num/10000000))+" Crore"+(num%10000000 ? " "+convert(num%10000000) : "");
  };
  const rupees = Math.floor(n);
  const paise  = Math.round((n - rupees) * 100);
  let result = "INR " + convert(rupees);
  if (paise) result += " and " + convert(paise) + " Paise";
  return result + " Only";
}

export interface BillData {
  receiptNo: string;
  date: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: { name: string; qty: number; rate: number; amount: number; hsnSac?: string; company?: string; batchNo?: string }[];
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  paymentType: "advance" | "full";
  paymentMethod: string;
  deliveryDate?: string;
}

interface Props {
  data: BillData;
  type: "receipt" | "invoice";
}

export default function BillReceipt({ data, type }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Bill - ${data.orderNumber}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; font-size: 11px; color: #000; }
        table { width:100%; border-collapse:collapse; }
        td, th { border:1px solid #000; padding:4px 6px; }
        .no-border td, .no-border th { border:none; }
        .header-table td { border:none; }
        @media print { body { -webkit-print-color-adjust: exact; } }
      </style></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const displayAmount = data.paymentType === "advance" ? data.advanceAmount : data.totalAmount;
  const fyYear = "2026-2027";

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-3 justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
        >
          <Printer className="w-4 h-4" /> Print Bill
        </button>
      </div>

      {/* Bill content */}
      <div ref={printRef} style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#000", maxWidth: "800px", margin: "0 auto", border: "2px solid #000", padding: "0" }}>

        {/* Header */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ border: "none", width: "80px", padding: "8px", verticalAlign: "middle" }}>
                <img src={logoImg} alt="Sanap Logo" style={{ width: "70px", height: "70px", objectFit: "contain" }} />
              </td>
              <td style={{ border: "none", textAlign: "center", padding: "8px", verticalAlign: "middle" }}>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>Sanap Hi- Tech Nursery (I) Pvt. Ltd.F.Y.{fyYear}</div>
                <div style={{ fontSize: "10px", marginTop: "3px" }}>Dhakambe, Next to Arogya Vidnyan Vidyapeeth, Dindori Road, Tal. Dindori, Dist. Nashik - 422004</div>
                <div style={{ fontSize: "10px" }}>Email ID : info.sanapnursery@gmail.com | Web : sanapnurseryindia.com</div>
                <div style={{ fontSize: "10px", fontWeight: "bold" }}>Mob No. : 7447770803 / 7447770805</div>
              </td>
              {type === "invoice" && (
                <td style={{ border: "1px solid #000", padding: "6px", width: "200px", verticalAlign: "top", fontSize: "10px" }}>
                  <div><strong>Invoice No.</strong> : SHN/26-27/{data.receiptNo}</div>
                  <div style={{ marginTop: "4px" }}><strong>Invoice Date</strong> : {data.date}</div>
                  <div style={{ marginTop: "4px" }}><strong>Vehicle No.</strong> :</div>
                  <div style={{ marginTop: "4px" }}><strong>Nursery Lic No.</strong> : LASD06070331</div>
                  <div style={{ marginTop: "4px" }}><strong>GST No.</strong> : 27ABQCS0161G1Z8</div>
                </td>
              )}
            </tr>
          </tbody>
        </table>

        {/* Title */}
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "14px", borderTop: "2px solid #000", borderBottom: "1px solid #000", padding: "4px" }}>
          {type === "receipt" ? "RECEIPT" : "CREDIT INVOICE"}
        </div>

        {/* Customer Info */}
        {type === "receipt" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ border: "none", padding: "6px 8px", width: "50%" }}>
                  <strong>Receipt No. :</strong> {data.receiptNo}
                </td>
                <td style={{ border: "none", padding: "6px 8px", textAlign: "right" }}>
                  <strong>Date :</strong> {data.date}
                </td>
              </tr>
              <tr>
                <td style={{ border: "none", padding: "2px 8px" }}>
                  <strong>Received with Thanks From :</strong> {data.customerName}
                </td>
                <td style={{ border: "none" }}></td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: "none", padding: "2px 8px 6px 8px", borderBottom: "1px solid #000" }}>
                  <strong style={{ marginLeft: "160px" }}>{data.customerAddress} Mob - {data.customerPhone}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ border: "none", padding: "4px 8px" }}>
                  <strong>Name :</strong> {data.customerName}
                </td>
                <td style={{ border: "none", padding: "4px 8px", textAlign: "right" }}>
                  <strong>Mob.No. :</strong> {data.customerPhone}
                </td>
                <td style={{ border: "none", padding: "4px 8px", textAlign: "right" }}>
                  <strong>Party GST No.:</strong>
                </td>
              </tr>
              <tr>
                <td style={{ border: "none", padding: "2px 8px" }}>
                  <strong>Place :</strong> {data.customerAddress}
                </td>
                <td colSpan={2} style={{ border: "none", padding: "2px 8px", textAlign: "right", fontSize: "10px", fontStyle: "italic" }}>
                  (ORIGINAL FOR RECIPIENT / TRANSPORTER)
                </td>
              </tr>
              <tr>
                <td colSpan={3} style={{ border: "none", padding: "2px 8px 4px 8px", borderBottom: "1px solid #000" }}>
                  <strong>State Name &amp; Code :</strong> Maharashtra (27)
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Items Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #000", padding: "5px", width: "40px" }}>S.No.</th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Particulars</th>
              {type === "invoice" && (
                <>
                  <th style={{ border: "1px solid #000", padding: "5px", width: "60px" }}>HSN/SAC No</th>
                  <th style={{ border: "1px solid #000", padding: "5px", width: "80px" }}>Company Name</th>
                  <th style={{ border: "1px solid #000", padding: "5px", width: "80px" }}>Batch No</th>
                </>
              )}
              <th style={{ border: "1px solid #000", padding: "5px", width: "70px" }}>Qty</th>
              <th style={{ border: "1px solid #000", padding: "5px", width: "60px" }}>Rate</th>
              <th style={{ border: "1px solid #000", padding: "5px", width: "80px" }}>
                {type === "receipt" ? "Amount" : "Total Amount"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i}>
                <td style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}>{i + 1}</td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>{item.name}</td>
                {type === "invoice" && (
                  <>
                    <td style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}>{item.hsnSac || ""}</td>
                    <td style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}>{item.company || ""}</td>
                    <td style={{ border: "1px solid #000", padding: "5px", textAlign: "center" }}>{item.batchNo || ""}</td>
                  </>
                )}
                <td style={{ border: "1px solid #000", padding: "5px", textAlign: "right" }}>{item.qty.toLocaleString("en-IN")}</td>
                <td style={{ border: "1px solid #000", padding: "5px", textAlign: "right" }}>{item.rate.toFixed(2)}</td>
                <td style={{ border: "1px solid #000", padding: "5px", textAlign: "right" }}>{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
            {/* Empty rows for spacing */}
            {Array.from({ length: Math.max(0, 4 - data.items.length) }).map((_, i) => (
              <tr key={`empty-${i}`} style={{ height: "24px" }}>
                <td style={{ border: "1px solid #000" }}></td>
                <td style={{ border: "1px solid #000" }}></td>
                {type === "invoice" && (
                  <>
                    <td style={{ border: "1px solid #000" }}></td>
                    <td style={{ border: "1px solid #000" }}></td>
                    <td style={{ border: "1px solid #000" }}></td>
                  </>
                )}
                <td style={{ border: "1px solid #000" }}></td>
                <td style={{ border: "1px solid #000" }}></td>
                <td style={{ border: "1px solid #000" }}></td>
              </tr>
            ))}
            {/* Total row */}
            <tr>
              <td colSpan={type === "invoice" ? 5 : 1} style={{ border: "1px solid #000", padding: "5px" }}></td>
              <td style={{ border: "1px solid #000", padding: "5px", textAlign: "right", fontWeight: "bold" }}>
                {data.items.reduce((s, i) => s + i.qty, 0).toLocaleString("en-IN")}
              </td>
              <td style={{ border: "1px solid #000", padding: "5px" }}></td>
              <td style={{ border: "1px solid #000", padding: "5px", textAlign: "right", fontWeight: "bold" }}>
                {data.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        {type === "receipt" ? (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ border: "none", padding: "6px 8px", borderBottom: "1px solid #000" }}>
                    <strong>Amount in Word:</strong> {toWords(displayAmount)}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", padding: "4px 8px" }}>
                    <strong>Delivery Date: {data.deliveryDate || "-"}</strong>
                    <span style={{ marginLeft: "80px" }}><strong>Payment Mode : </strong>{data.paymentMethod}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "2px solid #000" }}>
              <tbody>
                <tr>
                  <td style={{ border: "none", padding: "8px", width: "50%", fontSize: "16px", fontWeight: "bold" }}>
                    ₹ {displayAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ border: "none", padding: "8px", textAlign: "center" }}>Customer Sign</td>
                  <td style={{ border: "none", padding: "8px", textAlign: "right" }}>
                    For Sanap Hi- Tech Nursery (I) Pvt. Ltd.F.Y.{fyYear}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ border: "none", padding: "6px 8px" }}>
                    <strong>Amt. In Words :</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", padding: "2px 8px 6px 8px", borderBottom: "1px solid #000" }}>
                    {toWords(data.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "6px 8px", width: "160px", verticalAlign: "top" }}>
                    <strong>Outstanding Amount</strong><br />
                    <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                      {data.paymentType === "advance"
                        ? `${data.remainingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} Dr`
                        : "NIL"}
                    </span>
                  </td>
                  <td style={{ border: "1px solid #000", padding: "6px 8px", fontSize: "9px" }}>
                    We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                    {data.paymentType === "advance" && (
                      <div style={{ marginTop: "4px" }}>
                        <strong>Advance Amt : ₹{data.advanceAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                      </div>
                    )}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "center", width: "160px", fontWeight: "bold", fontSize: "10px" }}>
                    For SANAP HI- TECH NURSERY (I) PVT. LTD.F.Y.<br />{fyYear}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", padding: "8px" }}><strong>Customer Sign</strong></td>
                  <td style={{ border: "none" }}></td>
                  <td style={{ border: "none" }}></td>
                </tr>
              </tbody>
            </table>
            <div style={{ borderTop: "1px solid #000", padding: "4px 8px", fontSize: "8px", textAlign: "center" }}>
              Sanap Hi-Tech Nursery Pvt Ltd, Bank Name - HDFC Bank, A/c No - 99999900005111 (Current), IFS Code - HDFC0002041, Branch - Panchavati, Nashik. *PHONE PAY - NO - 9325486500 &nbsp;&nbsp; <strong>SUBJECT TO DINDORI JURISDICTION</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
