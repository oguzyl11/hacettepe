import { ContactMethod, ItemCategory, ItemCondition } from "@prisma/client";
import type { Listing } from "@/lib/listings";

export const sampleListings: Listing[] = [
  {
    id: "ornek-kalkulus",
    title: "Thomas Calculus, 14. baskı",
    description:
      "Mühendislik birinci sınıf kalkülüs kitabı. Kenar notları kurşun kalemle, sayfalar eksiksiz. Karşılığında lineer cebir ya da fizik kitabı arıyorum.",
    category: ItemCategory.KITAP,
    condition: ItemCondition.AZ_KULLANILMIS,
    images: [],
    createdAt: "2026-03-02T09:00:00.000Z",
    commentCount: 1,
    owner: {
      id: "ornek-elif",
      name: "Elif Yılmaz",
      email: "elif.yilmaz@hacettepe.edu.tr",
      instagramHandle: null,
      preferredContact: ContactMethod.EMAIL,
    },
    comments: [
      {
        id: "ornek-yorum-1",
        body: "Çözüm kitabı da yanında mı?",
        createdAt: "2026-03-03T14:20:00.000Z",
        authorName: "Kerem Aydın",
      },
    ],
  },
  {
    id: "ornek-klavye",
    title: "Mekanik klavye, kırmızı switch",
    description:
      "Bir dönem yurtta kullandım. Tüm tuşlar çalışıyor, kablo dahil. Karşılığında kulaklık veya mouse düşünebilirim.",
    category: ItemCategory.ELEKTRONIK,
    condition: ItemCondition.ORTA_KULLANILMIS,
    images: [],
    createdAt: "2026-03-04T11:30:00.000Z",
    commentCount: 0,
    owner: {
      id: "ornek-kerem",
      name: "Kerem Aydın",
      email: "kerem.aydin@hacettepe.edu.tr",
      instagramHandle: "kerem.aydin",
      preferredContact: ContactMethod.INSTAGRAM,
    },
    comments: [],
  },
  {
    id: "ornek-mont",
    title: "Bej yün palto, beden M",
    description:
      "Kampüste bir kış giydim. Kuru temizleme gördü, leke yok. Beden S-M arası bir kabanla takaslamak istiyorum.",
    category: ItemCategory.GIYIM,
    condition: ItemCondition.AZ_KULLANILMIS,
    images: [],
    createdAt: "2026-02-18T16:00:00.000Z",
    commentCount: 0,
    owner: {
      id: "ornek-zeynep",
      name: "Zeynep Kaya",
      email: "zeynep.kaya@hacettepe.edu.tr",
      instagramHandle: "zynpkaya",
      preferredContact: ContactMethod.EMAIL,
    },
    comments: [],
  },
  {
    id: "ornek-lamba",
    title: "Masa lambası, sıcak ışık",
    description:
      "Yurt masasına sığıyor, dimmer’ı çalışıyor. Taşınırken bırakacağım. Karşılığında küçük bir kitaplık ya da organizer olur.",
    category: ItemCategory.EV_ESYASI,
    condition: ItemCondition.COK_KULLANILMIS,
    images: [],
    createdAt: "2026-01-22T08:15:00.000Z",
    commentCount: 1,
    owner: {
      id: "ornek-elif",
      name: "Elif Yılmaz",
      email: "elif.yilmaz@hacettepe.edu.tr",
      instagramHandle: null,
      preferredContact: ContactMethod.EMAIL,
    },
    comments: [
      {
        id: "ornek-yorum-2",
        body: "Ampul dahil mi, yoksa sadece gövde mi?",
        createdAt: "2026-01-23T19:05:00.000Z",
        authorName: "Zeynep Kaya",
      },
    ],
  },
  {
    id: "ornek-raket",
    title: "Badminton raketi ve 3 top",
    description:
      "Beytepe kortunda kullandım. Teli yeni, sap sargısı yıpranmış. Spor çantası veya yoga matı ile değişebilir.",
    category: ItemCategory.SPOR,
    condition: ItemCondition.ORTA_KULLANILMIS,
    images: [],
    createdAt: "2026-02-27T13:40:00.000Z",
    commentCount: 0,
    owner: {
      id: "ornek-kerem",
      name: "Kerem Aydın",
      email: "kerem.aydin@hacettepe.edu.tr",
      instagramHandle: "kerem.aydin",
      preferredContact: ContactMethod.INSTAGRAM,
    },
    comments: [],
  },
  {
    id: "ornek-defter",
    title: "Noktalı defter seti, 3 adet",
    description:
      "Açılmamış, yeni gibi. Ders notu tutmak için aldım ama kareliye döndüm. Marker seti veya kalemlik arıyorum.",
    category: ItemCategory.KIRTASIYE,
    condition: ItemCondition.YENI_GIBI,
    images: [],
    createdAt: "2026-03-08T10:10:00.000Z",
    commentCount: 0,
    owner: {
      id: "ornek-zeynep",
      name: "Zeynep Kaya",
      email: "zeynep.kaya@hacettepe.edu.tr",
      instagramHandle: "zynpkaya",
      preferredContact: ContactMethod.EMAIL,
    },
    comments: [],
  },
];
