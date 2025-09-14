export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="sticky top-[100vh] text-white p-4 text-center">
      #seneca{year}{" "}
      <a className="hover:" href="https://seneca.camp/impressum/">
        Impressum
      </a>
    </footer>
  );
}
