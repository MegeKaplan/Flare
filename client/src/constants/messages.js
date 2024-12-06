export const MESSAGES = {
  CONTENT_LOADING: "İçerik yükleniyor...",
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
  POST_NOT_FOUND: "Gönderi bulunamadı!",
};
