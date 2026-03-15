

const PROMOS = {
  left: [
    "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/desk_block_6_03_32846ec55a.png",
    "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/desk_block_6_02_d4625c9f29.png",
  ],
  middle: "https://cdn2.fptshop.com.vn/unsafe/1080x0/filters:format(webp):quality(75)/desk_block_6_01_3d52749144.png",
  right: [
    "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/desk_block_6_06_e103427ad5.png",
    "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/desk_block_6_05_6500a2de5f.png",
    "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/desk_block_6_04_377b03a3bc.png",
  ],
};

export default function PromoBanners() {
  return (
    <div className="mt-10 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Hội xuân tri ân, quà đầy kho</h2>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="col-span-3 flex flex-col gap-4 h-[630px]">
          <div className="flex-1 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all">
            <img src={PROMOS.left[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="promo" />
          </div>
          <div className="h-[220px] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all">
            <img src={PROMOS.left[1]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="promo" />
          </div>
        </div>

        {/* Middle Column */}
        <div className="col-span-6 h-[630px] rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all">
          <img src={PROMOS.middle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="main promo" />
        </div>

        {/* Right Column */}
        <div className="col-span-3 flex flex-col gap-4 h-[630px]">
          {PROMOS.right.map((img, idx) => (
            <div key={idx} className="flex-1 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all">
              <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="promo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
