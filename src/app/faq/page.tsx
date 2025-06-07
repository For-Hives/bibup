// src/app/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Frequently Asked Questions about buying, selling, and organizing events on BibUp.",
  title: "FAQ | BibUp",
};

const faqStyles = {
  sectionTitle: {
    borderBottom: "2px solid #eee",
    paddingBottom: "10px",
    marginBottom: "15px",
    marginTop: "30px",
    fontSize: "2em",
  },
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  question: {
    fontWeight: "bold" as const,
    marginBottom: "8px",
    fontSize: "1.2em",
    color: "#333",
  },
  answer: {
    marginBottom: "20px",
    lineHeight: "1.6",
    fontSize: "1em",
    color: "#555",
  },
  header: { textAlign: "center" as const, marginBottom: "30px" },
};

export default function FAQPage() {
  return (
    <div style={faqStyles.container}>
      <header style={faqStyles.header}>
        <h1>Frequently Asked Questions</h1>
      </header>

      <section>
        <h2 style={faqStyles.sectionTitle}>Pour les Vendeurs</h2>
        <div>
          <h3 style={faqStyles.question}>
            Comment puis-je vendre mon dossard ?
          </h3>
          <p style={faqStyles.answer}>
            Pour vendre votre dossard, vous devez d'abord créer un compte sur
            BibUp. Une fois connecté, accédez à la section "Vendre un dossard",
            remplissez les informations concernant la course (nom, date, lieu),
            le type de dossard, et fixez votre prix. Assurez-vous que le
            transfert de dossard est autorisé par l'organisateur de la course.
          </p>
        </div>
        <div>
          <h3 style={faqStyles.question}>
            Quels sont les frais pour vendre un dossard ?
          </h3>
          <p style={faqStyles.answer}>
            BibUp prélève une commission de X% sur le prix de vente final de
            votre dossard. Cette commission nous aide à maintenir la plateforme
            et à offrir un support client de qualité.
          </p>
        </div>
        <div>
          <h3 style={faqStyles.question}>
            Comment suis-je payé une fois mon dossard vendu ?
          </h3>
          <p style={faqStyles.answer}>
            Une fois la vente confirmée et le dossard transféré à l'acheteur, le
            paiement sera crédité sur votre compte BibUp. Vous pourrez ensuite
            transférer les fonds vers votre compte bancaire via nos options de
            paiement sécurisées.
          </p>
        </div>
        <div>
          <h3 style={faqStyles.question}>
            Que se passe-t-il si l'organisateur de la course n'autorise pas le
            transfert de dossard ?
          </h3>
          <p style={faqStyles.answer}>
            Il est de votre responsabilité de vérifier les conditions de
            transfert de dossard auprès de l'organisateur avant de lister votre
            dossard sur BibUp. Si un transfert est impossible, vous ne pourrez
            pas vendre votre dossard via notre plateforme. Les annonces non
            conformes pourront être retirées.
          </p>
        </div>
      </section>

      <section>
        <h2 style={faqStyles.sectionTitle}>Pour les Acheteurs</h2>
        <div>
          <h3 style={faqStyles.question}>
            Comment puis-je acheter un dossard ?
          </h3>
          <p style={faqStyles.answer}>
            Parcourez les listes de dossards disponibles sur notre page
            "Événements" ou utilisez la barre de recherche. Une fois que vous
            avez trouvé un dossard qui vous intéresse, cliquez sur "Acheter" et
            suivez les instructions pour finaliser la transaction de manière
            sécurisée.
          </p>
        </div>
        <div>
          <h3 style={faqStyles.question}>
            Comment puis-je être sûr que le dossard est valide ?
          </h3>
          <p style={faqStyles.answer}>
            BibUp s'efforce de vérifier l'authenticité des dossards listés. Nous
            demandons aux vendeurs de fournir une preuve d'inscription. De plus,
            nous retenons le paiement au vendeur jusqu'à ce que l'acheteur
            confirme la réception et la validité du dossard (ou un certain délai
            après la course). En cas de problème, notre support client est là
            pour vous aider.
          </p>
        </div>
        <div>
          <h3 style={faqStyles.question}>
            Quels sont les modes de paiement acceptés ?
          </h3>
          <p style={faqStyles.answer}>
            Nous acceptons les principaux modes de paiement, y compris les
            cartes de crédit (Visa, MasterCard, American Express) et PayPal.
            Toutes les transactions sont sécurisées.
          </p>
        </div>
        <div>
          <h3 style={faqStyles.question}>
            Que faire si une course est annulée ou reportée ?
          </h3>
          <p style={faqStyles.answer}>
            Si une course est annulée, la politique de remboursement dépendra
            des termes de l'organisateur et de la politique de BibUp au moment
            de l'événement. En cas de report, le dossard sera généralement
            valable pour la nouvelle date. Veuillez consulter nos termes et
            conditions ou contacter le support pour des cas spécifiques.
          </p>
        </div>
      </section>

      <section>
        <h2 style={faqStyles.sectionTitle}>
          Pour les Organisateurs de Courses
        </h2>
        <div>
          <h3 style={faqStyles.question}>
            Comment BibUp peut-il aider mon événement ?
          </h3>
          <p style={faqStyles.answer}>
            BibUp offre une plateforme pour gérer les transferts de dossards de
            manière sécurisée et officielle, réduisant le marché noir et les
            problèmes le jour de la course. Nous pouvons collaborer pour mettre
            en place un système de transfert officiel via notre plateforme, ou
            simplement aider à communiquer vos politiques de transfert.
          </p>
        </div>
        <div>
          <h3 style={faqStyles.question}>
            Pouvons-nous lister notre course comme "partenaire" sur BibUp ?
          </h3>
          <p style={faqStyles.answer}>
            Oui, nous encourageons les organisateurs à devenir partenaires. Les
            événements partenaires bénéficient d'une meilleure visibilité et
            d'options de gestion des transferts plus intégrées. Contactez notre
            équipe partenariat pour discuter des options.
          </p>
        </div>
        <div>
          <h3 style={faqStyles.question}>
            Comment BibUp gère-t-il la communication avec les acheteurs/vendeurs
            pour les transferts ?
          </h3>
          <p style={faqStyles.answer}>
            Pour les événements partenaires, nous pouvons intégrer les
            communications de transfert. Pour les autres, BibUp fournit les
            outils et informations nécessaires aux utilisateurs pour effectuer
            le transfert conformément à vos directives, mais la responsabilité
            finale du transfert (selon vos règles) incombe au vendeur et à
            l'acheteur.
          </p>
        </div>
      </section>
    </div>
  );
}
