// File: client/src/pages/Glossary/GlossaryPage.jsx
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'

const GlossaryPage = ({ language = 'de', onLanguageChange }) => {
  const isEnglish = language === 'en'
  const glossaryItems = [
    {
      termEn: 'AfA (Depreciation for Tax Purposes)',
      termDe: 'AfA (Absetzung für Abnutzung)',
      descriptionEn:
        'Annual tax-deductible depreciation of the building value. Typically 2 percent per year for residential buildings. Depreciation reduces taxable income.',
      descriptionDe:
        'Jährliche steuerliche Abschreibung des Gebäudewerts. Üblicherweise 2 Prozent pro Jahr bei Wohngebäuden. Die Abschreibung mindert das zu versteuernde Einkommen.',
    },
    {
      termEn: 'Auflassungsvormerkung (Priority Notice)',
      termDe: 'Auflassungsvormerkung (Vormerkung im Grundbuch)',
      descriptionEn:
        'A protective entry in the land register securing the buyer’s future ownership and preventing resale before transfer is completed.',
      descriptionDe:
        'Schützender Eintrag im Grundbuch, der den künftigen Eigentumsübergang sichert und einen Weiterverkauf vor Abschluss verhindert.',
    },
    {
      termEn: 'Bereitstellungszinsen (Commitment Interest)',
      termDe: 'Bereitstellungszinsen',
      descriptionEn:
        'Interest charged if the approved loan amount is not fully drawn within the agreed timeframe. Common in new construction projects.',
      descriptionDe:
        'Zinsen, die anfallen, wenn die zugesagte Darlehenssumme nicht innerhalb der vereinbarten Frist vollständig abgerufen wird. Häufig bei Neubauprojekten.',
    },
    {
      termEn: 'Bereitstellungszinsfreie Zeit (Commitment-Free Period)',
      termDe: 'Bereitstellungszinsfreie Zeit',
      descriptionEn:
        'The initial period during which no commitment interest is charged. Often 6 to 12 months and sometimes negotiable.',
      descriptionDe:
        'Anfangszeitraum, in dem keine Bereitstellungszinsen anfallen. Oft 6 bis 12 Monate und teilweise verhandelbar.',
    },
    {
      termEn: 'Eigenkapital (Equity)',
      termDe: 'Eigenkapital',
      descriptionEn:
        'The investor’s own capital contribution. Higher equity generally results in better financing conditions and lower risk.',
      descriptionDe:
        'Der eigene Kapitalanteil des Investors. Mehr Eigenkapital führt in der Regel zu besseren Finanzierungskonditionen und geringerem Risiko.',
    },
    {
      termEn: 'Grundbuch (Land Register)',
      termDe: 'Grundbuch',
      descriptionEn:
        'The official public register documenting ownership, mortgages, and third-party rights related to a property.',
      descriptionDe:
        'Das öffentliche Register, das Eigentum, Grundpfandrechte und Rechte Dritter an einer Immobilie dokumentiert.',
    },
    {
      termEn: 'Kaufvertrag (Purchase Agreement)',
      termDe: 'Kaufvertrag',
      descriptionEn:
        'The legally binding contract between buyer and seller, signed before a notary. Withdrawal is generally not possible after notarisation.',
      descriptionDe:
        'Rechtsverbindlicher Vertrag zwischen Käufer und Verkäufer, der vor dem Notar geschlossen wird. Ein Rücktritt ist nach der Beurkundung in der Regel nicht möglich.',
    },
    {
      termEn: 'Notar (Notary)',
      termDe: 'Notar',
      descriptionEn:
        'A legally required public official who drafts and notarises property purchase contracts in Germany.',
      descriptionDe:
        'Gesetzlich vorgeschriebener Amtsträger, der Immobilienkaufverträge in Deutschland erstellt und beurkundet.',
    },
    {
      termEn: 'Rendite (Return)',
      termDe: 'Rendite',
      descriptionEn:
        'The profitability of an investment. Investors distinguish between gross yield and net yield.',
      descriptionDe:
        'Die Rentabilität einer Investition. Es wird zwischen Brutto- und Nettorendite unterschieden.',
    },
    {
      termEn: 'Sondertilgung (Special Repayment)',
      termDe: 'Sondertilgung',
      descriptionEn:
        'Additional voluntary repayments allowed outside the regular instalment schedule, often up to 5 percent annually.',
      descriptionDe:
        'Zusätzliche freiwillige Rückzahlungen außerhalb des regulären Tilgungsplans, häufig bis zu 5 Prozent pro Jahr.',
    },
    {
      termEn: 'Spekulationsfrist (Speculation Period)',
      termDe: 'Spekulationsfrist',
      descriptionEn:
        'If a property is sold within 10 years of acquisition, capital gains may be taxable. After 10 years, gains are generally tax-free for private investors.',
      descriptionDe:
        'Wird eine Immobilie innerhalb von 10 Jahren nach Erwerb verkauft, kann der Gewinn steuerpflichtig sein. Nach 10 Jahren ist der Gewinn für private Anleger in der Regel steuerfrei.',
    },
    {
      termEn: 'Teilungserklaerung (Declaration of Division)',
      termDe: 'Teilungserklärung',
      descriptionEn:
        'Defines individual and common ownership within an apartment building, including voting rights and ownership shares.',
      descriptionDe:
        'Regelt das Sondereigentum und Gemeinschaftseigentum innerhalb eines Mehrfamilienhauses, einschließlich Stimmrechten und Miteigentumsanteilen.',
    },
    {
      termEn: 'Tilgung (Repayment Rate)',
      termDe: 'Tilgung (Tilgungssatz)',
      descriptionEn:
        'The portion of the mortgage payment that reduces the outstanding loan balance. Higher repayment rates reduce total interest costs.',
      descriptionDe:
        'Der Anteil der Darlehensrate, der die Restschuld verringert. Höhere Tilgungssätze senken die gesamten Zinskosten.',
    },
    {
      termEn: 'Zinsbindung (Fixed Interest Period)',
      termDe: 'Zinsbindung',
      descriptionEn:
        'The agreed period during which the interest rate remains fixed, commonly 10 to 30 years.',
      descriptionDe:
        'Der vereinbarte Zeitraum, in dem der Zinssatz festgeschrieben ist, häufig 10 bis 30 Jahre.',
    },
  ]

  return (
    <div className='bg-background min-h-screen flex flex-col font-body text-foreground transition-colors duration-300'>
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main className='flex-grow'>
        <section className='relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-border/50'>
          <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40'>
            <div className='absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px]' />
            <div className='absolute top-[20%] -left-[10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[60px]' />
          </div>

          <div className='max-w-6xl mx-auto px-6 lg:px-8 relative z-10 text-center space-y-4'>
            <p className='uppercase tracking-[0.3em] text-xs text-accent/70'>
              {isEnglish ? 'Glossary' : 'Glossar'}
            </p>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground'>
              {isEnglish
                ? 'Essential Terminology for Property Investment in Germany'
                : 'Wichtige Begriffe zur Immobilieninvestition in Deutschland'}
            </h1>
            <p className='text-base sm:text-lg text-foreground/70 max-w-3xl mx-auto'>
              {isEnglish
                ? 'Clear definitions of key terms you will encounter when financing or buying property in Germany.'
                : 'Klare Definitionen zentraler Begriffe, die Sie bei der Finanzierung oder dem Kauf von Immobilien in Deutschland begegnen.'}
            </p>
          </div>
        </section>

        <section className='py-12 sm:py-16'>
          <div className='max-w-6xl mx-auto px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {glossaryItems.map((item) => (
                <div
                  key={item.termEn}
                  className='rounded-2xl border border-border/60 bg-white/70 dark:bg-white/5 p-6 shadow-sm'
                >
                  <h2 className='text-lg font-semibold text-foreground mb-2'>
                    {isEnglish ? item.termEn : item.termDe}
                  </h2>
                  <p className='text-sm leading-relaxed text-foreground/70'>
                    {isEnglish ? item.descriptionEn : item.descriptionDe}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer language={language} />
    </div>
  )
}

export default GlossaryPage
