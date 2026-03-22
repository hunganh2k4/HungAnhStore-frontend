import { useEffect, useState } from "react";
import { useAuth } from "../../auth/auth.context";
import { privateApi } from "../../../shared/api/http";
import {
  Info,
  Edit3,
  Plus,
  Trash2,
  X
} from "lucide-react";

type Address = {
  id: string;
  address: string;
  type: string;
  isDefault: boolean;
};

export default function PersonalInfo() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [form, setForm] = useState({
    address: "",
    type: "Nhà riêng"
  });

  // =========================
  // VIETNAM ADDRESS DATA
  // =========================
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  // =============================
  // LOAD DATA
  // =============================
  const fetchAddresses = async () => {
    try {
      const res = await privateApi.get("/addresses");

      if (Array.isArray(res.data)) {
        setAddresses(res.data);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error(err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // LOAD VN PROVINCE DATA
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    )
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  // =============================
  // HANDLE CHANGE PROVINCE
  // =============================
  const handleProvince = (value: string) => {
    setProvince(value);

    const p = provinces.find((x) => x.Name === value);
    setDistricts(p?.Districts || []);

    setDistrict("");
    setWard("");
    setWards([]);
  };

  // =============================
  // HANDLE CHANGE DISTRICT
  // =============================
  const handleDistrict = (value: string) => {
    setDistrict(value);

    const d = districts.find((x) => x.Name === value);
    setWards(d?.Wards || []);

    setWard("");
  };

  // =============================
  // ADD
  // =============================
  const handleAdd = () => {
    setEditingAddress(null);
    setForm({ address: "", type: "Nhà riêng" });

    setProvince("");
    setDistrict("");
    setWard("");

    setOpenDrawer(true);
  };

  // =============================
  // EDIT
  // =============================
  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);

    setForm({
      address: addr.address,
      type: addr.type
    });

    setProvince("");
    setDistrict("");
    setWard("");

    setOpenDrawer(true);
  };

  // =============================
  // SAVE
  // =============================
  const handleSave = async () => {
    try {
      if (!form.address.trim()) return;

      const parts = [
        form.address,
        ward,
        district,
        province,
      ].filter(Boolean);

      const fullAddress = parts.join(", ");

      if (editingAddress) {
        await privateApi.put(`/addresses/${editingAddress.id}`, {
          address: fullAddress,
          type: form.type,
        });
      } else {
        await privateApi.post("/addresses", {
          address: fullAddress,
          type: form.type,
        });
      }

      setOpenDrawer(false);

      setForm({ address: "", type: "Nhà riêng" });
      setProvince("");
      setDistrict("");
      setWard("");
      setEditingAddress(null);

      fetchAddresses();
    } catch (err) {
      console.error("Save address error:", err);
    }
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    setEditingAddress(null);
    setForm({ address: "", type: "Nhà riêng" });
    setProvince("");
    setDistrict("");
    setWard("");
  };

  // =============================
  // DELETE
  // =============================
  const handleDelete = async (id: string) => {
    try {
      await privateApi.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // 1. update UI trước (chỉ 1 item true)
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );

      // 2. gọi API
      await privateApi.post(`/addresses/${id}/default`);

      // 3. sync lại data từ server
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">

      {/* Alert Banner */}
      {!user?.gender && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-blue-800 text-sm font-semibold">
              Vui lòng cập nhật giới tính để có trải nghiệm tốt hơn.
            </p>
          </div>
          <button className="text-blue-600 text-sm font-bold hover:underline">
            Cập nhật
          </button>
        </div>
      )}

      {/* THÔNG TIN CÁ NHÂN (GIỮ NGUYÊN) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-gray-50">
          <h3 className="text-lg font-medium text-gray-800 tracking-tight">
            Thông tin cá nhân
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 text-red-600 font-bold text-sm hover:underline"
          >
            <Edit3 className="w-4 h-4" />
            Cập nhật
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <span className="text-gray-500 font-medium">Họ và tên:</span>
            <span className="text-gray-900 font-medium">{user?.name || "Chưa cập nhật"}</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <span className="text-gray-500 font-medium">Số điện thoại:</span>
            <span className="text-gray-900 font-medium">{user?.phone || "Chưa cập nhật"}</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <span className="text-gray-500 font-medium">Giới tính:</span>
            <span className="text-gray-900 font-medium">-</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <span className="text-gray-500 font-medium">Email:</span>
            <span className="text-gray-900 font-medium">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <span className="text-gray-500 font-medium">Ngày sinh:</span>
            <span className="text-gray-900 font-medium">04/07/2004</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <span className="text-gray-500 font-medium whitespace-nowrap">
              Địa chỉ mặc định:
            </span>
            <span className="text-gray-900 font-medium text-right text-sm leading-relaxed">
              {addresses.find(a => a.isDefault)?.address || "Chưa có"}
            </span>
          </div>
        </div>
      </div>

      {/* SỔ ĐỊA CHỈ (GIỮ NGUYÊN) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-gray-50">
          <h3 className="text-lg font-medium text-gray-800 tracking-tight">
            Sổ địa chỉ
          </h3>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-red-600 font-bold text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Thêm địa chỉ
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 relative group transition-all hover:bg-white hover:shadow-md hover:border-red-100 max-w-lg"
              >
                <div
                  onClick={() => handleSetDefault(addr.id)}
                  className="absolute top-3 right-3 cursor-pointer"
                >
                  {addr.isDefault ? (
                    <div className="w-6 h-6 bg-white text-red-500 rounded-full flex items-center justify-center text-xs">
                      ✔
                    </div>
                  ) : (
                    <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-gray-300 hover:border-red-500">
                      ✓
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-900 text-base">
                      {addr.type}
                    </h4>

                    {addr.isDefault && (
                      <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded font-bold">
                        Mặc định
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {addr.address}
                </p>

                <div className="flex items-center justify-end gap-4 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-gray-400 font-bold text-xs hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>

                  <span className="text-gray-200">|</span>

                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-red-500 font-bold text-xs hover:underline"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DRAWER (CHỈ THÊM INPUT LOGIC, KHÔNG ĐỔI UI) */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/30"
            onClick={closeDrawer}
          />

          <div className="w-[420px] bg-white h-full shadow-xl animate-slide-in-right flex flex-col">

            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
              </h2>
              <button onClick={closeDrawer}>✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

              {/* TỈNH */}
              <div>
                <select
                  value={province}
                  onChange={(e) => handleProvince(e.target.value)}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">-- Chọn Tỉnh/Thành phố --</option>

                  {provinces.map((p) => (
                    <option key={p.Id} value={p.Name}>
                      {p.Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* HUYỆN */}
              <div>
                <select
                  value={district}
                  onChange={(e) => handleDistrict(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  disabled={!districts.length}
                >
                  <option value="">-- Chọn Quận/Huyện --</option>

                  {districts.map((d) => (
                    <option key={d.Id} value={d.Name}>
                      {d.Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* XÃ */}
              <div>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  disabled={!wards.length}
                >
                  <option value="">-- Chọn Phường/Xã --</option>

                  {wards.map((w) => (
                    <option key={w.Id} value={w.Name}>
                      {w.Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ADDRESS */}
              <div>
                <p className="mb-2">Địa chỉ nhà</p>
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Nhập địa chỉ nhà"
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="w-full border p-2 mb-3"
              >
                <option value="Nhà riêng">Nhà riêng</option>
                <option value="Công ty">Công ty</option>
              </select>
            </div>

            <div className="p-5 border-t">
              <button
                onClick={handleSave}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
              >
                {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}