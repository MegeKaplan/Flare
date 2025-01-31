import { PuffLoader } from "react-spinners";

export const MESSAGES = {
  CONTENT_LOADING: (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <PuffLoader color="#fdc422" loading size={100} speedMultiplier={2} />
    </div>
  ),
  NO_MORE_CONTENT: "Maalesef sona geldik gibi gözüküyor!",
  ERROR_OCCURRED: "Bir hata oluştu!",
  USERNAME_REQUIRED: "Kullanıcı adı boş bırakılamaz!",
  EMAIL_REQUIRED: "E-posta boş bırakılamaz!",
  EMAIL_INVALID: "Geçersiz e-posta adresi!",
  PASSWORD_REQUIRED: "Şifre boş bırakılamaz!",
  PASSWORD_LENGTH: (minLength) =>
    `Şifre en az ${minLength} karakter olmalıdır!`,
  PASSWORDS_NOT_MATCH: "Şifreler eşleşmiyor!",
  FILE_LIMIT: (limit) => `En fazla ${limit} resim seçebilirsiniz!`,
  IMAGE_REQUIRED: "En az bir resim seçmelisiniz!",
  POST_CONTENT_REQUIRED: "Gönderi içeriği boş bırakılamaz!",
  MESSAGE_TEXT_REQUIRED: "Mesaj boş bırakılamaz!",
  POST_NOT_FOUND: "Gönderi bulunamadı!",
  LINK_COPIED_TO_CLIPBOARD: "Link panoya kopyalandı.",
};
