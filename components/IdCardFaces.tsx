import Image from 'next/image';
import type { CardPerson } from '@/lib/id-card';

const impact = { fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' };
// Standard CR80 ID card, portrait.
const cardSize = { width: '54mm', height: '85.6mm' };

export function CardFront({ person }: { person: CardPerson }) {
  return (
    <div style={cardSize} className="relative flex shrink-0 flex-col overflow-hidden rounded-[3mm] bg-[#050505] text-white outline outline-[0.2mm] outline-neutral-500">
      <div className="flex h-[17mm] items-start justify-between bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 px-[3mm] pt-[2.5mm]">
        <Image src="/logo.png" alt="" width={40} height={40} className="h-[9mm] w-[9mm] object-contain" />
        <div className="text-right">
          <p className="text-[9pt] leading-none" style={impact}>
            TEENSRAVE
          </p>
          <p className="mt-[0.8mm] text-[4.5pt] font-bold tracking-[0.12em] uppercase">Official ID</p>
        </div>
      </div>

      <div className="absolute top-[10.5mm] left-1/2 h-[30mm] w-[24mm] -translate-x-1/2 overflow-hidden rounded-[2mm] border-[0.6mm] border-[#050505] bg-neutral-800">
        {person.photo ? (
          <Image src={person.photo} alt={person.name} width={240} height={300} unoptimized className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[22pt] text-neutral-400" style={impact}>
            {person.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="mt-[26mm] flex flex-1 flex-col items-center px-[3mm] text-center">
        <p className="line-clamp-2 text-[13pt] leading-[1.05] uppercase" style={impact}>
          {person.name}
        </p>
        <p className="mt-[1.2mm] line-clamp-2 text-[6.5pt] font-semibold text-neutral-300">{person.subtitle || ' '}</p>
        <p className="mt-[1.5mm] rounded-full border-[0.2mm] border-green-400 px-[2.5mm] py-[0.5mm] text-[5.5pt] font-bold tracking-[0.1em] text-green-400 uppercase">{person.badge}</p>
      </div>

      <div className="bg-white py-[1.6mm] text-center text-[9pt] leading-none font-bold tracking-[0.15em] text-black">{person.code}</div>
    </div>
  );
}

export function CardBack({ person }: { person: CardPerson }) {
  return (
    <div style={cardSize} className="flex shrink-0 flex-col overflow-hidden rounded-[3mm] bg-[#050505] px-[3.5mm] py-[3.5mm] text-white outline outline-[0.2mm] outline-neutral-500">
      <p className="text-[10pt] leading-none uppercase" style={impact}>
        Details
      </p>
      <div className="mt-[1mm] h-[0.5mm] w-[10mm] rounded-full bg-green-500" />
      <dl className="mt-[3mm] space-y-[1.8mm]">
        {person.details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[4.5pt] font-bold tracking-[0.08em] text-neutral-400 uppercase">{label}</dt>
            <dd className="truncate text-[7pt] font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto">
        <div className="mb-[0.8mm] h-[6mm] border-b-[0.2mm] border-neutral-500" />
        <p className="text-[4.5pt] font-bold tracking-[0.08em] text-neutral-400 uppercase">Authorised signature</p>
        <p className="mt-[1.8mm] text-[4.8pt] leading-[1.3] text-neutral-400">
          This card is the property of TeensRave and must be shown on request. If found, please return to infousteensrave@gmail.com.
        </p>
      </div>
    </div>
  );
}
