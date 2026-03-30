import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { getBlogs } from '@/services/contentApi'
import { Calendar, ChevronLeft, Clock, Lightbulb, Lock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

const toSectionId = (heading) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')

export const legacyBlogPosts = [
  {
    id: 1,
    slug: 'germany-heating-law-reform-2026',
    title: 'Germany Heating Law Reform 2026: Strategic Implications for Property Owners & Investors',
    excerpt:
      'A strategic breakdown of the 2026 heating law update, including what changed, cost implications, valuation effects, and financing decisions for buyers and owners.',
    category: 'Policy Update',
    date: 'February 25, 2026',
    readTime: '8 min',
    image: '/blog/berlin_altbau.png',
    isLive: true,
    datePublished: '2026-02-25',
    dateModified: '2026-02-25',
  },
  {
    id: 2,
    slug: 'negotiate-estate-agent-fee-germany',
    title: "Should You Negotiate the Estate Agent's Fee in Germany? (Honest Answer: It Depends)",
    excerpt: "The Maklerprovision can run to tens of thousands of euros. Learn when negotiating helps, when it hurts, and how to protect your deal.",
    category: "Buyer's Guide",
    date: 'March 9, 2026',
    readTime: '10 min',
    image: '/blog/berlin_modern.png',
    isLive: true,
    datePublished: '2026-03-09',
    dateModified: '2026-03-09',
  },
  {
    id: 3,
    slug: 'five-things-before-making-offer-germany',
    title: 'Five Things to Do Before You Make an Offer on a Property in Germany',
    excerpt:
      "Most buyers spend weeks choosing the property and about ten minutes thinking about the negotiation. That imbalance is expensive. Here's how to fix it.",
    category: "Buyer's Quick Guide",
    date: 'March 9, 2026',
    readTime: '9 min',
    image: '/blog/berlin_villa.png',
    isLive: true,
    datePublished: '2026-03-09',
    dateModified: '2026-03-09',
  },
  {
    id: 4,
    slug: 'berlin-150k-negotiation-story',
    title: 'We Walked Away €150,000 Richer — and the Seller Was Perfectly Happy About It',
    excerpt:
      "A Berlin property. A €950,000 asking price. Three elderly heirs who just wanted it resolved. Here's exactly how we got to €800,000 — and what every buyer can learn from it.",
    category: 'Real Negotiation Story',
    date: 'March 9, 2026',
    readTime: '9 min',
    image: '/blog/berlin_townhouse.png',
    isLive: true,
    datePublished: '2026-03-09',
    dateModified: '2026-03-09',
  },
  {
    id: 5,
    slug: 'question-that-could-save-50000-germany',
    title: 'The Question That Could Save You €50,000 on a German Property',
    excerpt: "It's not a complicated formula or a legal loophole. It's four words. And most buyers never think to say them.",
    category: "Buyer's Guide",
    date: 'March 9, 2026',
    readTime: '8 min',
    image: '/blog/berlin_walk.png',
    isLive: true,
    datePublished: '2026-03-09',
    dateModified: '2026-03-09',
  },
  {
    id: 6,
    slug: 'how-to-negotiate-property-prices-germany',
    title: 'How to Negotiate Property Prices in Germany — and Actually Save Thousands',
    excerpt: "Most buyers walk into property negotiations in Germany convinced the price tag is final. It isn't. Here's what changes when you come prepared.",
    category: 'Buyer Guide',
    date: 'March 9, 2026',
    readTime: '8 min',
    image: '/blog/berline_train.png',
    isLive: true,
    datePublished: '2026-03-09',
    dateModified: '2026-03-09',
  },
]

const heatingLawArticle = {
  lead: [
    'Germany is planning changes to its heating law. The reform of the Building Energy Act (GEG) could give homeowners more flexibility when replacing old heating systems.',
    'But what does this really mean for you as a property owner, buyer, or investor? At Baufiking, we focus on how this affects your money, your property value, and your long-term costs, not just the legal details.',
  ],
  sections: [
    {
      heading: 'What Was the Rule Until Now?',
      paragraphs: ['Since 2023, new heating systems had to use at least 65% renewable energy. This mainly meant installing:'],
      bullets: [
        'Heat pumps',
        'Hybrid systems',
        'Biomass heating',
        'District heating',
        'Solar-supported systems',
        'Installing new gas or oil heating systems became very limited.',
      ],
    },
    {
      heading: 'What Is Changing in 2026?',
      paragraphs: [
        'The coalition between CDU/CSU and SPD wants to change the rules.',
        'The Federal Government of Germany is proposing more technology openness. This could allow homeowners to choose their heating system more freely, possibly including gas systems again. The proposal still needs approval from the German Parliament (Bundestag).',
      ],
    },
    {
      heading: 'Does This Mean Gas Heating Is Safe Again?',
      paragraphs: ['Not necessarily. Even if gas systems are allowed again:'],
      bullets: [
        'CO2 prices are expected to rise.',
        'Energy costs remain unpredictable.',
        'EU climate targets still exist.',
        'So while the law may become more flexible, long-term costs could still increase.',
      ],
    },
    {
      heading: 'What Does This Mean for Property Owners?',
      paragraphs: ['Heating decisions are no longer just technical. They are financial.'],
      cards: [
        {
          title: 'Installation Costs vs. Running Costs',
          text: 'Gas heating may be cheaper to install. Heat pumps may cost more upfront but can be cheaper over time. The key question is: what will cost you less over 20 years?',
        },
        {
          title: 'Property Value',
          text: 'Energy-efficient homes are easier to sell and often achieve better prices. Buyers and banks pay attention to energy efficiency ratings, monthly heating costs, and future upgrade risks.',
        },
        {
          title: 'Financing',
          text: 'Banks increasingly look at energy efficiency when approving loans. If a property has high future heating costs, it may influence loan approval, financing terms, and long-term affordability.',
        },
      ],
    },
    {
      heading: "Baufiking's Approach",
      paragraphs: [
        "We do not just ask, 'What is allowed?' We ask, 'What makes financial sense for you?'",
        'More legal flexibility does not automatically mean better financial outcomes.',
      ],
      bullets: [
        'The real long-term cost of your heating choice',
        'How rising CO2 costs could affect you',
        'Which subsidies can reduce your investment',
        'How your decision impacts resale value',
      ],
    },
    {
      heading: 'Final Thought',
      paragraphs: [
        'The Germany Heating Law Reform 2026 may give homeowners more freedom. But smart property decisions are still based on long-term planning, stable costs, and protecting asset value.',
        'If you are buying, refinancing, or modernizing a property in Germany, Baufiking helps you make decisions that are financially sound, not just legally compliant.',
      ],
    },
  ],
}

const maklerFeeArticle = {
  lead: [
    "The Maklerprovision can run to tens of thousands of euros. Of course you want to negotiate it. But before you do, read this - because getting it wrong can cost you the property entirely.",
    "Here's something nobody tells you when you start looking at property in Germany: the estate agent - the Makler - is one of the most important relationships in your entire purchase process. Not the seller. Not the notary. The agent.",
    'That changes how you should think about their fee.',
    'In most countries, buyers treat agent fees as a pure cost to be minimised. In Germany, that instinct can get you into trouble. The Makler controls access to the seller, manages the offer process, and - crucially - influences how your offer is presented. An agent who respects you as a serious buyer will advocate for you, quietly or otherwise. An agent who feels you have been difficult or disrespectful? Less so.',
    "This doesn't mean you should never question the commission. It means you should be strategic about when and how you do it - and honest with yourself about what you're trying to achieve.",
  ],
  sections: [
    {
      heading: 'What the Maklerprovision Actually Is - and How Much It Costs',
      paragraphs: [
        'Since December 2020, a German law requires that when a Makler is commissioned by both buyer and seller, the commission is split equally between them. In practice, this typically means each party pays around 3.57% of the purchase price including VAT - though the exact figure varies by state and is always negotiable in principle.',
        "On a €600,000 property, that's roughly €21,420 from you as the buyer. On a €900,000 property, closer to €32,000. It's not a small number - and it's entirely understandable that buyers look at it and wonder if there's room to move.",
        "There sometimes is. But the question isn't just whether you can negotiate it. It's whether you should - and when.",
        'The commission is real money. But so is the property. Sometimes protecting one means being strategic about the other.',
      ],
      tip:
        "Not sure what commission structure applies to the property you're considering, or how it varies by region? A Baufiking.de consultant can break this down for your specific situation before you engage with the agent.",
    },
    {
      heading: "The Agent's Role - and Why It Matters More Than Most Buyers Realise",
      paragraphs: [
        'In competitive markets like Berlin, Munich, or Hamburg, the Makler is the gatekeeper. They decide which viewings to arrange, which offers to present first, and how enthusiastically they describe a particular buyer to the seller.',
        'That last point is rarely discussed openly, but anyone who has bought property in Germany knows it is real. Two offers at the same price will not always be treated equally. A buyer who has been professional, responsive, and easy to work with is a less risky bet - and agents communicate that to sellers, whether explicitly or through tone.',
        'Transactions also take time. A sale in Germany can take three to six months from offer acceptance to the notary appointment. Agents who have complicated or contentious relationships with a buyer will sometimes quietly steer sellers towards cleaner options.',
        "None of this means you should be a pushover. It means you should be intentional about how and when you choose to push.",
        "The agent isn't your adversary. In the right circumstances, they're your most useful ally. How you treat them early on determines which of those they become.",
      ],
    },
    {
      heading: 'When Negotiating the Fee Can Make Sense',
      paragraphs: [
        "There are genuine situations where raising the commission is reasonable, well-timed, and unlikely to damage your relationship with the agent. Here's when those moments tend to arise:",
      ],
      bullets: [
        'The property is high-value.',
        "On properties above €800,000 or €1 million, even a half-percentage-point reduction in commission is a meaningful sum. Agents handling high-value transactions are often more open to this conversation - provided the buyer is clearly serious and financially prepared. The key is to raise it late in the process, after trust has been established, and frame it as a practical discussion rather than a challenge.",
        "When it works: The deal is large, your financing is confirmed, and you've built a professional relationship with the agent over several weeks.",
        'The property has been sitting on the market for months.',
        'A Makler who has been managing an unsold listing for four, five, or six months has their own incentives to close. Their time, marketing costs, and opportunity cost are all mounting. A buyer who is prepared to move quickly and cleanly - with financing confirmed and a realistic offer ready - is genuinely valuable to them. In this context, a quiet conversation about the commission is less likely to cause friction.',
        'When it works: The listing has been active for 90+ days, you have financing in place, and you are ready to move to contract quickly.',
        "You're a cash buyer or have pre-approved financing.",
        'Certainty is currency in German property transactions. If you can offer the agent - and through them the seller - the confidence that this deal will close without financing complications, you have something worth trading. A small concession on commission in exchange for speed and certainty is a reasonable ask.',
        'When it works: You have a Finanzierungsbestaetigung in hand and can commit to a realistic timeline at the point of offer.',
      ],
    },
    {
      heading: 'When You Should Leave the Commission Alone',
      paragraphs: [
        "For every situation where negotiating the fee makes sense, there are three where it doesn't. These are the scenarios where raising the commission can actively cost you the property:",
      ],
      bullets: [
        'When multiple buyers are competing.',
        'In a competitive situation - two, three, or more interested buyers - you cannot afford to give the agent any reason to deprioritise your offer. Negotiating the commission in this context signals that your attention is on saving money rather than securing the property. It is almost certain to work against you.',
        'When it backfires: There are other viewings booked, or the agent has mentioned "strong interest" from other parties.',
        'In the early stages of the relationship.',
        'The first viewing, the first enquiry, the first offer - these are not the moments to introduce a fee discussion. You have not yet established yourself as a serious, reliable buyer. Raising it too early creates a transactional dynamic from the start that is very hard to walk back.',
        'When it backfires: You are at the first or second viewing, or you have not yet discussed price or financing with the agent.',
        "When the agent controls the seller's access.",
        'On some properties - particularly off-market or discreetly listed ones - the Makler is the only route to the seller. In these cases, the relationship with the agent is the deal. Jeopardising it over a commission conversation that represents a fraction of the purchase price is a poor trade.',
        'When it backfires: The property is not publicly listed, or the agent has made it clear they have a close relationship with the seller.',
      ],
    },
    {
      heading: 'A Real Example: Berlin, €650,000 - Below Bank Valuation',
      paragraphs: [
        "Sometimes the best outcome comes not from negotiating the agent's fee, but from making the agent your ally.",
        'In one case we worked on in Berlin, our client purchased a property for €650,000 - despite the bank valuation sitting at around €720,000. The property was an inheritance sale; the sellers were motivated and wanted a smooth, fast transaction.',
        "What made the difference wasn't the commission negotiation. We didn't raise it. What made the difference was the relationship our client had built with the Makler over several weeks: professional, responsive, financially credible, and easy to deal with.",
        'When multiple offers came in, the agent presented ours first - and presented it warmly. The sellers accepted. The saving on the property price alone was €70,000 below bank valuation. The commission, paid in full, was a fraction of that.',
      ],
      tableRows: [
        { label: 'Property location', value: 'Berlin' },
        { label: 'Bank valuation', value: '€720,000' },
        { label: 'Purchase price', value: '€650,000', tone: 'success' },
        { label: 'Saving vs valuation', value: '€70,000', tone: 'success' },
        { label: 'Commission approach', value: 'Paid in full - relationship preserved', tone: 'warning' },
        { label: 'Key factor', value: 'Agent trust and buyer credibility' },
      ],
      quote:
        'We saved €70,000 on the property price by keeping the agent on our side. The commission conversation never needed to happen.',
      tip:
        'Every negotiation is different. A Baufiking.de consultant can assess your specific situation and advise whether - and how - to raise the commission question without jeopardising the deal.',
    },
    {
      heading: 'The Smarter Play: Build the Relationship First',
      paragraphs: [
        "Here's the reframe that changes how most buyers approach this: the Makler's fee is one line in a transaction that will define where you live and how much you pay for the next decade or more. Treating it as the primary battleground is rarely the right decision.",
        'The buyers who consistently get the best outcomes in Germany are the ones who treat the agent as a professional counterpart. They arrive prepared. They communicate clearly. They follow up when they say they will. They do not waste the agent\'s time. And when they do raise a commercial question - about price, terms, or commission - it lands differently because the groundwork has been done.',
        "That groundwork takes time and experience. If you're navigating this for the first time, or in a market you don't know well, having someone alongside you who understands how these relationships work is one of the most valuable things you can have.",
        "The agent's fee is negotiable. Your relationship with the agent is not something you can easily rebuild once it's damaged. Know the difference.",
      ],
    },
    {
      heading: "Buying property in Germany? Let's talk strategy.",
      paragraphs: [
        'At Baufiking.de, we work with property buyers across Germany to research listings, obtain professional valuations, structure strong offers, and navigate agent relationships - so you can negotiate effectively without burning the bridges you need.',
        "Whether you're deciding whether to negotiate the commission, preparing an offer, or working through a complex inheritance sale - our consultants have been here before. We can help you decide what to push on, what to leave alone, and how to get to the right outcome.",
        'Contact Baufiking.de today - and go into every negotiation knowing exactly where you stand.',
      ],
    },
  ],
}

const fiveStepsNegotiationArticle = {
  lead: [
    "Most buyers spend weeks choosing the property and about ten minutes thinking about the negotiation. That imbalance is expensive. Here's how to fix it.",
    "There's a version of property buying in Germany where you find a place you love, fall for it slightly too hard, and pay whatever is asked because you don't want to lose it. It happens all the time. And it costs people — on average — somewhere between €20,000 and €80,000 more than they needed to spend.",
    "Then there's the other version. You do your homework, you understand the market, and you walk into the negotiation as the most prepared person in the room. That version has a very different outcome.",
    "The five steps below aren't complicated. They don't require legal expertise or a background in finance. They require time, attention, and the willingness to ask a few questions that most buyers never think to ask.",
  ],
  sections: [
    {
      heading: 'At a Glance',
      tableRows: [
        { label: '01', value: 'Research the market — Know what comparable properties really sell for' },
        { label: '02', value: 'Find the weak spots — Turn every flaw into a negotiating chip' },
        { label: '03', value: "Ask the right questions — Uncover the seller's real motivation" },
        { label: '04', value: "Make a structured offer — Signal you're serious — and backed by data" },
        { label: '05', value: "Stay professional & data-driven — In Germany, facts beat emotion every time" },
      ],
    },
    {
      heading: 'STEP 01: Research the Market Before You Fall in Love With a Property',
      paragraphs: [
        "This step comes first for a reason — it has to happen before the viewing, not after. Once you've walked through a property and started imagining your life in it, your judgement shifts. Prices that looked high on paper start feeling acceptable. That's human. It's also expensive.",
        "Before you set foot inside, spend an hour on Immobilienscout24 or Immowelt looking at comparable properties in the same neighbourhood. What are similar-sized homes actually selling for? Not listed for — selling for. There's often a gap, and that gap is your starting point.",
        "Pay particular attention to how long individual listings have been up. A property sitting on the market for 60, 90, or 120 days is quietly raising a white flag. It's saying: the price isn't landing. In a market where well-priced properties move quickly, duration is data.",
        "The listing price is the seller's opening position. The market data is yours. Know it before you walk in.",
      ],
      tip:
        "Not sure how to read local market data or spot an overpriced listing? A Baufiking.de consultant can pull recent comparable sales and listing histories for any property you're considering — before you make an enquiry.",
    },
    {
      heading: 'STEP 02: Look at the Property Like Someone Who Has to Fix It',
      paragraphs: [
        "Most people view a property with the eye of someone who wants to live in it. That's natural — but for the purposes of negotiation, it's the wrong lens. For at least part of the viewing, look at it like someone who has to spend money on it.",
        "Outdated heating system? That's a replacement cost. Poor energy rating that doesn't meet current GEG standards? That's a renovation. Ageing roof, damp in the basement, single-glazed windows? Every one of those is a number on a page — and a reason your offer should reflect reality, not the seller's wishful thinking.",
        'If you\'re serious about the property, commission a Baugutachten — a professional building survey — before you make a formal offer. In Germany, once you sign the Kaufvertrag, the defects are yours. A survey protects you legally and practically, and the findings become the factual backbone of your negotiation.',
        "You're not complaining. You're presenting evidence. That's a very different conversation.",
        "Every crack, every ageing boiler, every damp patch is a conversation about price. Document them. They add up faster than you'd think.",
      ],
      tip:
        'Baufiking.de can help you connect with trusted building surveyors and interpret survey findings in terms of what they mean for your offer. Reach out before you commission the survey so we can advise on what to look for.',
    },
    {
      heading: 'STEP 03: Ask the Questions That Actually Matter',
      paragraphs: [
        "There are two questions that, asked at the right moment in the right way, can tell you almost everything you need to know about a negotiation's potential. Most buyers never think to ask either of them.",
        'The first is: "How flexible is the seller on the price?"',
        'Agents won\'t tell you the seller is desperate. But they will signal. If the answer is "the owner is open to discussions" or "serious offers will be considered" — that\'s an invitation, not small talk. If they pause before answering, that pause is information too.',
        'The second is: "Why is the property being sold?"',
        'A seller relocating for work, navigating a divorce, managing an inheritance, or dealing with financial pressure is in a fundamentally different position from someone who is simply testing the market. Each situation creates different levels of flexibility — and different approaches.',
        "Inheritance sales in particular deserve attention. When heirs are selling a property they didn't buy and don't live in, the emotional attachment to the asking price is lower. When multiple heirs share the proceeds, even a significant reduction becomes manageable when divided — and the speed and certainty of a reasonable offer often matters more than holding out for the maximum.",
        "The seller's situation shapes the entire negotiation. You can't read it from the listing. You have to ask.",
      ],
      tip:
        "A Baufiking.de consultant can help you prepare the right questions for your specific situation and interpret what an agent's responses really mean. It's one of the most valuable conversations you can have before making an offer.",
    },
    {
      heading: 'STEP 04: Build an Offer That Speaks for Itself',
      paragraphs: [
        "Here's where most buyers who've done steps one to three still go wrong. They've done the research. They know the market. They understand the seller's situation. And then they submit a number on a WhatsApp message with no context and no supporting evidence.",
        'A strong offer in Germany is a document, not just a figure. It should include your proposed purchase price, confirmation from your bank that financing is in place, and — crucially — the reasoning behind the number. That reasoning should reference the valuations you\'ve obtained, the market comparables you\'ve reviewed, and any documented renovation costs from your survey.',
        'The bank confirmation deserves particular emphasis. Sellers and agents in Germany have had offers collapse at the financing stage. A buyer who walks in with a Finanzierungsbestaetigung is a buyer who gets taken seriously. It removes one of the biggest sources of uncertainty — and sellers reward certainty.',
        "One more thing: don't offer at the bank's valuation. Offer slightly above it. That extra cushion signals that you're a serious buyer who has done the analysis and is making a fair offer — not a speculative one. It's a small concession that removes the defensive instinct and opens the door to a conversation.",
        'Your offer should make the agent think: this buyer has done the work. That thought changes everything about how your offer is handled.',
      ],
      tip:
        "Need help structuring your offer or obtaining a financing confirmation quickly? Baufiking.de works with buyers at exactly this stage. Get in touch and we'll help you build an offer that gets taken seriously.",
    },
    {
      heading: "STEP 05: Keep It Professional — Even When It's Personal",
      paragraphs: [
        "This one is harder than it sounds. By the time you're negotiating on a property, you probably like it quite a lot. Maybe you love it. The temptation to push harder, show too much enthusiasm, or let frustration leak into the conversation is real.",
        "Don't. German property negotiations are not won through emotion. They're won through preparation, patience, and professionalism. The moment a negotiation becomes heated or personal, it stops being about data and starts being about egos — and that rarely ends well for the buyer.",
        'There\'s also a practical reason to stay measured: you may need the agent on your side. They act for the seller, but they also want the deal to close. An agent who respects you as a professional counterpart is more likely to advocate quietly for your offer than one who sees you as difficult.',
        'If the seller rejects your first offer, ask why. Ask what would need to change for it to work. Ask if there are non-price terms — a faster completion, more flexible moving dates — that might bridge the gap. Sometimes the negotiation isn\'t purely about the number.',
        "Patience is a negotiating tactic. Sellers who've been waiting six months often come around — especially when your offer is the most credible one they've seen.",
      ],
      tip:
        "If a negotiation isn't moving, or you're not sure how to respond to a rejection, a Baufiking.de consultant can help you assess your options and decide whether to hold, adjust, or walk away.",
    },
    {
      heading: 'The Honest Truth About Negotiating in Germany',
      paragraphs: [
        "None of this is a guarantee. Some sellers are inflexible. Some properties are fairly priced and there's simply nothing to negotiate. And some deals don't come together regardless of how prepared you are.",
        "But the buyers who follow these five steps consistently end up in a better position than those who don't. They make fewer impulsive offers. They waste less time on properties where the numbers will never work. And when the right opportunity appears, they're ready for it — prepared, credible, and confident.",
        "The difference between paying the asking price and saving €50,000 is rarely about boldness. It's almost always about doing the work beforehand.",
        'The negotiation starts long before you make the call. The buyers who know that are the ones who save the money.',
      ],
    },
    {
      heading: 'Ready to buy property in Germany?',
      paragraphs: [
        'The consultants at Baufiking.de support buyers at every stage — from understanding local valuations and researching listings, to building structured offers and negotiating purchase prices that reflect the real market.',
        "If you're planning a property purchase in Germany, speak with a Baufiking consultant before you make your next move. It's the most valuable conversation you can have.",
        'Contact Baufiking.de today — and negotiate from a position of strength.',
      ],
    },
  ],
}

const berlin150kArticle = {
  lead: [
    'A Berlin property. A €950,000 asking price. Three elderly heirs who just wanted it resolved. Here\'s exactly how we got to €800,000 — and what every buyer can learn from it.',
    'Christmas Eve, 2023. Most people were doing their last-minute shopping or wrapping presents. We were finalizing a property deal in the Biesdorf area of Berlin that had just come in €150,000 below the asking price.',
    "This isn't a story about luck or aggressive tactics. It's about something far more reliable: preparation. Before a single offer was made, we had done the research, understood the seller's situation, and built an argument that the data fully supported. By the time we sat down with the agent, the negotiation had already been won on paper.",
    "Here's exactly how it happened — step by step.",
  ],
  sections: [
    {
      heading: 'Deal Snapshot',
      tableRows: [
        { label: 'Listed Price', value: '€950,000' },
        { label: 'Final Price', value: '€800,000', tone: 'success' },
        { label: 'Total Saved', value: '€150,000', tone: 'success' },
      ],
    },
    {
      heading: 'STEP 01: We Checked How Long the Property Had Been Sitting',
      paragraphs: [
        "The first thing we did wasn't view the property. It was researching it. Specifically, we wanted to know how long it had been on the market — because in Germany, that number tells you a great deal.",
        'Using the property address and a Chrome extension called Rote Kapsel alongside Immobilienscout24, we pieced together the listing history. The result was unambiguous: the property had been on the market for over six months.',
        'Six months is a long time in a market where well-priced properties move quickly. It usually means one of two things — either the asking price is too high, or demand in that area has softened. In this case, it was the first. The price had been set above what the market would bear, and the listing had sat there quietly accumulating days while the sellers waited for a buyer who would just pay it.',
        "A property that's been listed for six months isn't just unsold — it's telling you something. We listened.",
      ],
      tip:
        "Want to know the listing history of a property you're considering? A Baufiking.de consultant can research this for you before you even book a viewing.",
    },
    {
      heading: 'STEP 02: We Found Out What the Bank Actually Thought It Was Worth',
      paragraphs: [
        "Next, we needed to know the real numbers — not the seller's numbers, but the market's. We used two professional valuation tools that are standard in the German property industry: vdp and Sprengnetter.",
        'Between them, they gave us two critical figures: the Verkehrswert — the market value — and the Beleihungswert, which is the value a bank would lend against the property. These aren\'t opinions. They\'re calculated, methodology-backed valuations that banks and professional assessors use every day.',
        'The gap between those figures and the asking price was significant. The property was listed well above both. That gave us our anchor — and more importantly, it gave us something to show.',
      ],
      tip:
        'Getting accurate valuations before making an offer is one of the most important steps buyers skip. Baufiking.de works with professional valuation data and can help you understand exactly what a fair price looks like for any property you\'re considering.',
    },
    {
      heading: 'STEP 03: We Understood Why They Were Selling',
      paragraphs: [
        "This is the part that most buyers treat as background noise. It shouldn't be.",
        'During our initial conversations with the agent, we learned that the original owners of the property had passed away. The sale was being handled by three elderly heirs — adult children, most likely — who had no particular interest in managing or renovating the property. They wanted a clean resolution.',
        "That changes everything. These weren't sellers who had spent years building equity in a home they loved and had a strong emotional price attached to it. They were people dealing with an estate, probably managing the whole process from a distance, and dividing the proceeds in three ways.",
        "Here's the maths that matters: a €150,000 reduction, split three ways, is €50,000 each. That's a meaningful number, but weighed against the cost, stress, and time of continuing to manage an unsold property for another six months — for many heirs, the calculation tips towards accepting a reasonable offer now over holding out indefinitely.",
        "When the seller isn't selling a home they lived in, the emotional floor drops out of the negotiation. That's not a weakness to exploit — it's a reality to understand.",
      ],
      tip:
        "Identifying the seller's motivation before making an offer is a skill that takes experience. Your Baufiking.de consultant does this regularly and can help you read between the lines of what an agent tells you.",
    },
    {
      heading: 'STEP 04: We Built Credibility Before We Said a Word About Price',
      paragraphs: [
        "Here's a detail that most negotiation guides leave out entirely: the conversation before the negotiation matters as much as the negotiation itself.",
        'Before any discussion of price, we arranged a meeting with the estate agent. At that meeting, we asked a simple, professional question: what valuation tools did they use when pricing the property?',
        "The agent named one of the same platforms we had already used. That moment — small as it sounds — shifted the entire dynamic. We weren't just another buyer with an opinion about price. We were a party that understood the methodology, spoke the same language, and had done the same work. The agent knew immediately that any offer we made would have substance behind it.",
        'In Germany, this matters enormously. Agents are not impressed by assertiveness. They are impressed by the preparation. If you can demonstrate that you understand how the market works, you become someone worth having a serious conversation with.',
        "We didn't walk in arguing. We walked in as peers. That changed what the agent was willing to share — and how seriously our offer was taken.",
      ],
    },
    {
      heading: 'STEP 05: We Made an Offer That Was Serious — Not Insulting',
      paragraphs: [
        "This is where a lot of buyers get it wrong. They do all the right research, understand the seller's situation, get the valuations — and then submit an offer so low that it kills the goodwill they've spent weeks building.",
        "We didn't do that. We made an offer that was €30,000 above the bank's valuation. Not at the bank's value, and certainly not below it. That extra cushion was deliberate. It said: we have done the analysis, we know what this property is worth, and we are making you a fair and serious offer that acknowledges the real market — not the wishful thinking in the original listing.",
        'The sellers accepted.',
        'The final price of €800,000, against a listing of €950,000, represented a saving of €150,000. The transaction completed. On Christmas Eve.',
      ],
    },
    {
      heading: 'The Final Numbers',
      tableRows: [
        { label: 'Listed price', value: '€950,000' },
        { label: 'Agreed price', value: '€800,000', tone: 'success' },
        { label: 'Total saved', value: '€150,000', tone: 'success' },
        { label: 'Location', value: 'Biesdorf, Berlin' },
        { label: 'Date', value: '24 December 2023' },
      ],
    },
    {
      heading: 'What This Actually Took',
      paragraphs: [
        "Looking back at those five steps, none of them are complicated. There's no insider access required, no special legal knowledge, no particular talent for confrontation. What it took was time, attention, and the discipline to do the groundwork before walking through the door.",
        "The listing history was public. The valuation tools are available to professionals. The seller's motivation came out in a straightforward conversation. The credibility-building happened in a single meeting. The offer was calibrated, not guessed.",
        "Every one of those steps is repeatable. The question is whether you know what to look for — and whether you have someone alongside you who's done it before.",
        "This wasn't a lucky break. It was a process. And it's a process that works.",
      ],
    },
    {
      heading: 'Planning to buy property in Germany?',
      paragraphs: [
        'The team at Baufiking.de has helped buyers across Germany research listings, obtain professional valuations, understand seller motivations, and negotiate purchase prices that reflect the real market — not the wishful one.',
        "Whether you're still browsing or ready to make your move, a conversation with a Baufiking consultant is the most valuable thing you can do before your next offer.",
        'Contact Baufiking.de today — and negotiate from strength.',
      ],
    },
  ],
}

const negotiationQuestionArticle = {
  lead: [
    "It's not a complicated formula or a legal loophole. It's four words. And most buyers never think to say them.",
    "There's a particular kind of silence that follows a property viewing. You've walked the rooms, you like what you see, and now you're standing outside with the estate agent while your mind quietly does the maths. The price feels too high, but you're not sure if you're allowed to say so.",
    "Here's the thing — you are. And in Germany, doing it well is less about confidence and more about knowing which questions unlock the conversation. Most buyers skip past this entirely and either pay full price or walk away. A small number of buyers ask the right questions and save tens of thousands of euros.",
    'This piece is about those questions.',
  ],
  sections: [
    {
      heading: 'The Four Words That Open Every Negotiation',
      paragraphs: [
        'The single most effective thing you can ask an estate agent during or after a viewing is this:',
        'The Opening Question',
      ],
      quote: '"How flexible is the seller on the price?"',
      paragraphsAfterQuote: [
        'It sounds almost too simple. But the response you get will tell you far more than the listing ever will. Agents in Germany are professional — they won\'t blurt out that the seller is desperate. But they will signal. Listen carefully.',
        'If the agent says something like "the owner is open to discussions" or "serious offers will be considered", that\'s not polite small talk. That\'s an invitation. It means there\'s room, and they\'re waiting for you to walk through the door.',
        'If they say "the price is firm" but then pause or add "although it\'s worth making an offer" — that pause matters too.',
        "The agent's job is to sell the property. If there's flexibility, it's in their interest to let a motivated buyer know — even if they have to do it carefully.",
      ],
      tip:
        "Not sure how to read between the lines? A Baufiking.de consultant can join conversations with agents on your behalf and help you interpret what's actually being communicated. Reach out before your next viewing.",
    },
    {
      heading: 'The Follow-Up Question Most People Forget to Ask',
      paragraphs: [
        "Once you've established there's room to negotiate, your next question changes the entire dynamic of what follows:",
        'The Strategic Question',
      ],
      quote: '"Why is the owner selling the property?"',
      paragraphsAfterQuote: [
        "This isn't nosiness. It's a strategy. The reason behind a sale almost always determines how much flexibility exists — and how to approach the conversation.",
        "An owner who's simply testing the market to see what offers come in is in no hurry. They'll wait for you to come out. But a seller facing a relocation deadline, navigating a divorce, or managing a property they never intended to own? That person has a very different relationship with time — and with the asking price.",
        'Common reasons you might hear include:',
      ],
      bullets: [
        'Relocation — the owner has taken a job in another city or country and needs a clean exit',
        'Divorce or separation — the property needs to be sold as part of a financial settlement',
        'Financial pressure — mortgage payments are becoming unmanageable',
        'Downsizing — retirement has changed what the owner needs from their home',
        'Inheritance — the property has been passed down, and the heirs want to liquidate',
      ],
      tip:
        'Your Baufiking.de consultant can help you research the listing history, cross-check it against local market data, and build a fact-based offer — so your negotiation has substance behind it, not just intuition.',
    },
    {
      heading: 'Why Inheritance Properties Deserve Your Attention',
      paragraphs: [
        'Of all the situations listed above, inheritance sales are consistently where buyers find the most negotiating room. It\'s worth understanding why.',
        "When a property passes to heirs — often adult children — after the owner's death, the dynamic shifts entirely. These are people who didn't buy the property, have likely never paid a mortgage on it, and in many cases have no particular attachment to the figure on the listing. What they do have is a property that needs managing, insuring, maintaining, and potentially renovating. For many of them, a clean, fast sale at a reasonable price is preferable to holding out for top euro.",
        "They didn't buy it. They don't live in it. And in many cases, they just want it resolved. That changes everything about how a negotiation feels.",
        "It gets more interesting when multiple heirs are involved. If three or four people share the proceeds of a sale, the maths of a price reduction looks very different. A €60,000 reduction sounds significant — but split four ways, that's €15,000 each. For many heirs, the faster certainty of a lower offer outweighs the uncertainty of holding out for a higher one.",
        "This isn't about exploiting grief. It's about recognising that a motivated seller — whatever the reason — is a seller you can have an honest conversation with.",
      ],
      tip:
        "Identifying inheritance properties before they're listed, or reading the signs early in a negotiation, is something a Baufiking.de consultant does regularly. Get in touch if you want eyes on a property before you commit.",
    },
    {
      heading: 'Why These Questions Work So Well in Germany',
      paragraphs: [
        "German property negotiations are different from what you might expect if you've bought in other countries. There's no aggressive haggling, no theatrical walkouts, no pressure tactics. What there is, instead, is a strong respect for facts, preparation, and mutual reasonableness.",
        "That means the questions above work because they're framed correctly. You're not challenging the seller's price — you're understanding their situation. You're not low-balling — you're building the context for an offer that reflects reality. Germans, broadly, respond well to a buyer who has done their homework and approaches the conversation as a professional rather than a gambler.",
        "The estate agent, in this context, is your first real test. How they respond to your opening question tells you how much room exists. How you respond to that tells them what kind of buyer you are.",
        "In Germany, the difference between a buyer who pays full price and one who saves €40,000 is rarely about confidence. It's almost always about preparation.",
      ],
    },
    {
      heading: 'Before You Ask the Question — Do This First',
      paragraphs: [
        "None of this works if you walk in empty-handed. Asking the right questions opens the door, but you need something to walk through it with. That means doing your homework before the viewing, not after.",
        'At a minimum, you should know:',
      ],
      bullets: [
        'The Verkehrswert — the official market appraisal for the area and property type',
        'The Bodenrichtwert — the publicly available land value index for that postcode',
        'How long the property has been listed — check Immobilienscout24 or Immowelt for history',
        'Comparable recent sales nearby — your Baufiking.de consultant can pull this data for you',
      ],
      paragraphsAfterBullets: [
        "When you combine this with a building survey — a Baugutachten — that documents any defects or required upgrades, you're no longer negotiating on gut feeling. You're presenting a case. And in Germany, a well-presented case is taken seriously.",
      ],
      tip:
        'Not sure where to start with valuations or local market data? The team at Baufiking.de works with buyers at exactly this stage — before the offer, not after. Speak to a consultant to get the data that underpins a strong negotiation.',
    },
    {
      heading: 'The Takeaway',
      paragraphs: [
        "Most buyers overthink negotiation. They imagine it requires boldness, a thick skin, or some special talent for conflict. It doesn't. It requires curiosity — the willingness to ask a question and actually listen to the answer.",
        '"How flexible is the seller on the price?" Four words. A pause. And then, if you\'re paying attention, the beginning of a negotiation that could save you more than you\'d save in years of careful spending elsewhere.',
        'Ask the question. Then ask the next one. And if you want someone in your corner who knows exactly what to do with the answers — you know where to find us.',
      ],
    },
    {
      heading: 'Ready to negotiate smarter?',
      paragraphs: [
        "The consultants at Baufiking.de help buyers at every stage — from understanding valuations and researching listings to structuring offers and negotiating with confidence. Whether you're at the browsing stage or ready to make a move, a conversation with our team costs nothing and could save you tens of thousands.",
        'Visit Baufiking.de to speak with a consultant today.',
      ],
    },
  ],
}

const propertyNegotiationGermanyArticle = {
  lead: [
    "Most buyers walk into property negotiations in Germany convinced the price tag is final. It isn't. Here's what changes when you come prepared.",
    "Let's be honest — walking into a property negotiation in Germany can feel intimidating. The listings look official, the agents are professional, and there's an unspoken sense that the price you see is the price you pay. But here's something many first-time buyers don't realise: negotiation isn't just acceptable in the German property market — it's often expected.",
    "The trick is knowing how to do it. Germans don't respond well to lowball tactics or emotional appeals. What they do respond to is preparation, facts, and a calm, reasoned argument. Get that right, and you can realistically save tens of thousands of euros on your purchase.",
  ],
  sections: [
    {
      heading: '1. Find Out What the Property Is Actually Worth',
      paragraphs: [
        "Before you even think about making an offer, you need two numbers in your hand: the Verkehrswert (the market value appraisal) and the bank's Beleihungswert — the value the bank is willing to lend against. These aren't just formalities. If the asking price sits noticeably above both, you have a legitimate, data-backed reason to push back.",
        "You don't need to hire an independent surveyor straight away. The consultants at Baufiking.de can help you access this kind of data quickly, so you know exactly what a fair offer looks like before the conversation even starts.",
      ],
    },
    {
      heading: "2. Ask Why They're Selling — and Really Listen",
      paragraphs: [
        "This is one of the most underused tools in any negotiation. A seller who's relocating for work, going through a divorce, or dealing with an inherited property they never planned to keep is in a very different position from someone who's simply testing the market.",
        "Ask the agent directly. They may not tell you everything, but their answer — or their hesitation — will tell you a lot. If there's urgency on the seller's side, that becomes your negotiating leverage. You're not exploiting anyone; you're simply recognising that a faster, cleaner sale has real value for both parties.",
      ],
    },
    {
      heading: '3. Get a Building Survey — Then Use What You Find',
      paragraphs: [
        "In Germany, once you sign the Kaufvertrag, you own the property — defects and all. There's no going back. That makes a Baugutachten (building survey) one of the smartest investments you can make before an offer, not just for peace of mind, but as a negotiation tool.",
        "If the surveyor finds an ageing heating system, a roof that needs replacing, or insulation that falls below current GEG energy standards, document all of it. Bring quotes if you can. These aren't complaints — they're concrete, costed reasons why the asking price should come down. Sellers find that very hard to argue with.",
      ],
    },
    {
      heading: '4. Use Public Market Data to Anchor Your Offer',
      paragraphs: [
        "One of the most powerful things you can do is show up to a negotiation with publicly available data that contradicts the asking price. Germany has excellent tools for this. The Bodenrichtwert — the official land value index — is available through regional BORIS portals, and local Gutachterausschuss reports publish recent comparable sales in most areas.",
        "If properties with similar specifications have sold for less in the same postcode over the past 12 months, that's not opinion — that's market evidence. Present it calmly, without aggression, and let the data carry the weight of the argument.",
      ],
    },
    {
      heading: "5. Notice How Long It's Been Listed",
      paragraphs: [
        "Time is a negotiating asset that most buyers forget to use. If a property has been sitting on Immobilienscout24 or Immowelt for 60, 90, or even 120 days, that's not a coincidence — it usually means the price is too high, there's an issue the seller hasn't disclosed, or the market simply isn't biting.",
        "Check the listing history. Agents won't volunteer this, but the platforms often show it. A seller watching months tick by while carrying costs accumulate is far more motivated than one who listed last week. A respectful, below-asking offer in this context is often welcomed rather than dismissed.",
      ],
    },
    {
      heading: 'A quick note on tone',
      paragraphs: [
        "Property negotiation in Germany isn't a battle — it's a conversation between two parties trying to reach a fair outcome. Keep it professional and evidence-based, and you'll find most sellers and agents receptive. The moment it starts to feel like a confrontation, you've lost the room.",
      ],
    },
    {
      heading: 'The Bottom Line',
      paragraphs: [
        "You won't negotiate every German property seller down — some prices are genuinely fair and some sellers have no pressure to move. But many listings do have room. The buyers who find that room aren't aggressive hagglers. They're the ones who walk in with an appraisal in one hand, a survey report in the other, and a calm, reasonable argument for why their offer makes sense.",
        "That's not luck. That's preparation.",
      ],
    },
    {
      heading: 'Ready to buy property in Germany?',
      paragraphs: [
        'The consultants at Baufiking.de specialise in helping buyers navigate the German market — from valuations and financing to negotiation strategy. Get in touch for a no-obligation conversation before you make your next move.',
        'Contact Baufiking.de today',
      ],
    },
  ],
}

export const legacyArticleContentBySlug = {
  'germany-heating-law-reform-2026': heatingLawArticle,
  'negotiate-estate-agent-fee-germany': maklerFeeArticle,
  'five-things-before-making-offer-germany': fiveStepsNegotiationArticle,
  'berlin-150k-negotiation-story': berlin150kArticle,
  'question-that-could-save-50000-germany': negotiationQuestionArticle,
  'how-to-negotiate-property-prices-germany': propertyNegotiationGermanyArticle,
}

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export const renderLegacyArticleToHtml = (article) => {
  if (!article) return '<p></p>'

  const leadHtml = (article.lead || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')
  const sectionHtml = (article.sections || [])
    .map((section) => {
      const paragraphs = (section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')
      const bullets = section.bullets?.length
        ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : ''
      const paragraphsAfterBullets = (section.paragraphsAfterBullets || [])
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join('')
      const images = section.images?.length
        ? `<div>${section.images
            .map((image) => {
              const src = escapeHtml(image?.url || '')
              if (!src) return ''
              const alt = escapeHtml(image?.alt || image?.caption || section.heading || 'Article image')
              const caption = image?.caption ? `<figcaption>${escapeHtml(image.caption)}</figcaption>` : ''
              return `<figure><img src="${src}" alt="${alt}" loading="lazy" decoding="async" />${caption}</figure>`
            })
            .join('')}</div>`
        : ''
      const cards = section.cards?.length
        ? `<div>${section.cards
            .map((card) => `<h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.text)}</p>`)
            .join('')}</div>`
        : ''
      const tableRows = section.tableRows?.length
        ? `<table><tbody>${section.tableRows
            .map((row) => `<tr><th>${escapeHtml(row.label)}</th><td>${escapeHtml(row.value)}</td></tr>`)
            .join('')}</tbody></table>`
        : ''
      const quote = section.quote ? `<blockquote>${escapeHtml(section.quote)}</blockquote>` : ''
      const paragraphsAfterQuote = (section.paragraphsAfterQuote || [])
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join('')
      const tip = section.tip ? `<blockquote><strong>Baufiking Tip:</strong> ${escapeHtml(section.tip)}</blockquote>` : ''

      return `<section><h2>${escapeHtml(section.heading || '')}</h2>${paragraphs}${bullets}${paragraphsAfterBullets}${images}${cards}${tableRows}${quote}${paragraphsAfterQuote}${tip}</section>`
    })
    .join('')

  return `<div>${leadHtml}${sectionHtml}</div>`
}

export const getLegacyImportPayloads = () =>
  legacyBlogPosts.map((post, index) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    coverImage: post.image,
    readTime: post.readTime,
    contentHtml: renderLegacyArticleToHtml(legacyArticleContentBySlug[post.slug]),
    structuredContent: JSON.parse(JSON.stringify(legacyArticleContentBySlug[post.slug] || { lead: [], sections: [] })),
    isLive: Boolean(post.isLive),
    datePublished: post.datePublished || null,
    dateModified: post.dateModified || post.datePublished || null,
    displayOrder: index + 1,
    authorName: 'Ravinder Singh',
  }))

const formatBlogDate = (value) => {
  if (!value) return ''
  const dateValue = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(dateValue.getTime())) return ''
  return dateValue.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const normalizeCmsBlogPost = (post) => ({
  id: post._id,
  _id: post._id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt || '',
  category: post.category || '',
  date: formatBlogDate(post.datePublished || post.createdAt) || 'Draft',
  readTime: post.readTime || '',
  image: post.coverImage || '/blog/berlin_altbau.png',
  isLive: Boolean(post.isLive),
  datePublished: post.datePublished,
  dateModified: post.dateModified || post.updatedAt || post.createdAt,
  contentHtml: post.contentHtml || '',
  structuredContent: post.structuredContent || null,
  authorName: post.authorName || '',
  source: 'cms',
})

const buildHtmlWithHeadingIds = (html = '') => {
  if (!html || typeof window === 'undefined') {
    return { html: html || '', headings: [], introText: '' }
  }

  const parser = new window.DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const seen = new Map()
  const headings = []
  const introText = (doc.querySelector('p')?.textContent || '').trim()

  doc.querySelectorAll('h2, h3').forEach((heading) => {
    const text = heading.textContent?.trim() || ''
    if (!text) return

    const baseId = toSectionId(text) || `section-${headings.length + 1}`
    const count = seen.get(baseId) || 0
    seen.set(baseId, count + 1)
    const finalId = count === 0 ? baseId : `${baseId}-${count + 1}`
    heading.id = finalId

    let focus = ''
    let cursor = heading.nextElementSibling
    while (cursor && !focus) {
      if (cursor.tagName?.toLowerCase() === 'p') {
        focus = (cursor.textContent || '').trim()
      }
      if (/^h[1-6]$/i.test(cursor.tagName || '')) break
      cursor = cursor.nextElementSibling
    }

    headings.push({
      id: finalId,
      text,
      focus: focus ? `${focus.slice(0, 105)}${focus.length > 105 ? '...' : ''}` : '—',
    })
  })

  doc.querySelectorAll('script, iframe').forEach((node) => node.remove())

  return { html: doc.body.innerHTML, headings, introText }
}

const BlogPage = ({ language = 'de', onLanguageChange }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { slug } = useParams()
  const isEnglish = language === 'en'
  const [cmsBlogs, setCmsBlogs] = useState([])

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const blogs = await getBlogs()
        setCmsBlogs((blogs || []).map(normalizeCmsBlogPost))
      } catch (error) {
        setCmsBlogs([])
      }
    }
    loadBlogs()
  }, [])

  const mergedBlogPosts = useMemo(() => {
    const cmsBySlug = new Map(cmsBlogs.map((post) => [post.slug, post]))
    const legacyOnly = legacyBlogPosts
      .filter((post) => !cmsBySlug.has(post.slug))
      .map((post) => ({ ...post, source: 'legacy' }))

    return [...cmsBlogs, ...legacyOnly]
  }, [cmsBlogs])

  const activePost = useMemo(() => mergedBlogPosts.find((post) => post.slug === slug), [mergedBlogPosts, slug])
  const activeArticle = useMemo(() => (slug ? legacyArticleContentBySlug[slug] : null), [slug])
  const isCmsPost = activePost?.source === 'cms'
  const cmsStructuredArticle = useMemo(() => {
    if (!isCmsPost) return null
    const candidate = activePost?.structuredContent
    if (!candidate || !Array.isArray(candidate.sections) || candidate.sections.length === 0) return null
    return candidate
  }, [isCmsPost, activePost])
  const articleForSections = useMemo(
    () => (isCmsPost ? cmsStructuredArticle : activeArticle),
    [isCmsPost, cmsStructuredArticle, activeArticle]
  )
  const cmsPreparedContent = useMemo(
    () => (isCmsPost ? buildHtmlWithHeadingIds(activePost?.contentHtml || '') : { html: '', headings: [], introText: '' }),
    [isCmsPost, activePost]
  )

  const listCopy = {
    badge: isEnglish ? 'Baufiking Insights' : 'Baufiking Einblicke',
    title: isEnglish ? 'Market Intelligence Blog' : 'Markt-Intelligenz Blog',
    subtitle: isEnglish
      ? 'Clear, practical analysis for buyers, owners, and investors in Germany.'
      : 'Klare, praktische Analysen fuer Kaeufer, Eigentuemer und Investoren in Deutschland.',
    open: isEnglish ? 'Open article' : 'Artikel oeffnen',
    comingSoon: isEnglish ? 'Coming soon' : 'Demnaechst',
    unavailable: isEnglish ? 'This article is not published yet.' : 'Dieser Artikel ist noch nicht veroeffentlicht.',
  }

  useEffect(() => {
    const defaultTitle = 'Baufiking Blog | German Property Insights'
    const title = activePost?.isLive
      ? `${activePost.title} | Baufiking`
      : defaultTitle
    const description = activePost?.isLive
      ? activePost.excerpt
      : 'Strategic insights for buying, financing, and owning property in Germany.'
    const canonicalUrl = `${window.location.origin}${location.pathname}`
    const imageUrl = `${window.location.origin}${(activePost?.image || '/blog/berlin_altbau.png')}`

    document.title = title

    const upsertMeta = (selector, attributes) => {
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        document.head.appendChild(el)
      }
      Object.entries(attributes).forEach(([key, value]) => {
        el.setAttribute(key, value)
      })
    }

    const upsertLink = (selector, attributes) => {
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('link')
        document.head.appendChild(el)
      }
      Object.entries(attributes).forEach(([key, value]) => {
        el.setAttribute(key, value)
      })
    }

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: activePost?.isLive ? 'article' : 'website' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })

    let jsonLdScript = document.head.querySelector('script[data-seo="blog-jsonld"]')
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script')
      jsonLdScript.setAttribute('type', 'application/ld+json')
      jsonLdScript.setAttribute('data-seo', 'blog-jsonld')
      document.head.appendChild(jsonLdScript)
    }
    const jsonLd = activePost?.isLive
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: activePost.title,
          description: activePost.excerpt,
          datePublished: activePost.datePublished || '2026-02-25',
          dateModified: activePost.dateModified || activePost.datePublished || '2026-02-25',
          author: { '@type': 'Person', name: 'Ravinder Singh' },
          publisher: { '@type': 'Organization', name: 'Baufiking' },
          mainEntityOfPage: canonicalUrl,
          image: imageUrl,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Baufiking Blog',
          url: canonicalUrl,
        }
    jsonLdScript.textContent = JSON.stringify(jsonLd)
  }, [activePost, location.pathname])

  return (
    <div className="min-h-screen bg-background font-body text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main>
        {!slug && (
          <>
            <section
              className="relative overflow-hidden py-16 sm:py-20 border-b border-primary/10"
              style={{ background: 'linear-gradient(135deg, rgba(26,77,46,0.06) 0%, rgba(193,154,107,0.08) 100%)' }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
                <p className="text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: '#c19a6b' }}>
                  {listCopy.badge}
                </p>
                <h1 className="mt-2 text-3xl sm:text-5xl font-heading font-bold text-primary leading-tight">
                  {listCopy.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
                  {listCopy.subtitle}
                </p>
              </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mergedBlogPosts.map((post) => (
                  <article
                    key={post.id || post._id || post.slug}
                    className={`group relative h-full rounded-2xl bg-white overflow-hidden ${post.isLive ? 'cursor-pointer' : ''}`}
                    style={{
                      border: '1.5px solid rgba(26,77,46,0.10)',
                      boxShadow: '0 2px 8px rgba(26,77,46,0.07)',
                    }}
                    onClick={() => {
                      if (post.isLive) {
                        navigate(`/blogs/${post.slug}`)
                      }
                    }}
                    onKeyDown={(event) => {
                      if (!post.isLive) return
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        navigate(`/blogs/${post.slug}`)
                      }
                    }}
                    role={post.isLive ? 'button' : undefined}
                    tabIndex={post.isLive ? 0 : undefined}
                  >
                    <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#1a4d2e,#c19a6b)' }} />

                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={post.image} alt={post.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold">
                        <span style={{ color: '#c19a6b' }}>{post.category}</span>
                        {!post.isLive && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: 'rgba(26,77,46,0.08)', color: '#1a4d2e' }}>
                            <Lock className="h-3 w-3" />
                            {listCopy.comingSoon}
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-heading font-bold text-primary leading-snug mb-2 min-h-[84px] line-clamp-3">
                        {post.title}
                      </h2>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[96px] line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" style={{ color: '#c19a6b' }} />
                          {post.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" style={{ color: '#c19a6b' }} />
                          {post.readTime}
                        </span>
                      </div>

                      <div className="mt-auto pt-3 flex justify-end" style={{ borderTop: '1px solid rgba(26,77,46,0.07)' }}>
                        {post.isLive ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              navigate(`/blogs/${post.slug}`)
                            }}
                            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white group-hover:bg-primary/90 transition-colors"
                          >
                            {isEnglish ? 'Read more' : 'Mehr lesen'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            title={listCopy.unavailable}
                            className="text-sm font-semibold text-muted-foreground cursor-not-allowed"
                          >
                            {listCopy.comingSoon}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {slug && activePost?.isLive && (isCmsPost || activeArticle || articleForSections) && (
          <>
            <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10 xl:px-12 pt-10 pb-8">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-75 transition-opacity"
              >
                <ChevronLeft className="h-4 w-4" />
                {isEnglish ? 'Back to all blogs' : 'Zurueck zur Blog-uebersicht'}
              </Link>

              <p className="mt-5 text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: '#c19a6b' }}>
                {activePost.category}
              </p>
              <h1 className="mt-2 text-3xl sm:text-5xl font-heading font-bold text-primary leading-tight">
                {activePost.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" style={{ color: '#c19a6b' }} />
                  {activePost.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" style={{ color: '#c19a6b' }} />
                  {activePost.readTime}
                </span>
              </div>
            </section>

            <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10 xl:px-12 pb-14">
              <div className="mx-auto w-full max-w-5xl rounded-2xl overflow-hidden mb-8" style={{ border: '1px solid rgba(26,77,46,0.12)' }}>
                <img
                  src={activePost.image}
                  alt={activePost.title}
                  className="w-full h-[240px] sm:h-[320px] lg:h-[380px] object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <article className="rounded-2xl bg-white p-6 sm:p-10 lg:p-12" style={{ border: '1.5px solid rgba(26,77,46,0.10)' }}>
                {articleForSections ? (
                  <>
                    <div className="rounded-xl bg-primary/5 p-5 sm:p-6 mb-8" style={{ border: '1px solid rgba(26,77,46,0.12)' }}>
                      {(articleForSections.lead && articleForSections.lead.length > 0)
                        ? articleForSections.lead.map((paragraph, index) => (
                            <p key={`lead-${index}`} className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-3 last:mb-0">
                              {paragraph}
                            </p>
                          ))
                        : (
                            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                              {activePost.excerpt || 'Strategic, practical guidance from Baufiking.'}
                            </p>
                          )}
                    </div>

                    <section className="mb-10">
                      <h2 className="text-lg sm:text-xl font-heading font-bold text-primary mb-1">
                        {isEnglish ? 'Table of Contents' : 'Inhaltsverzeichnis'}
                      </h2>
                      <p className="text-xs text-muted-foreground mb-3">
                        {isEnglish ? 'Click any section to jump directly.' : 'Klicken Sie auf einen Abschnitt, um direkt zu springen.'}
                      </p>
                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(26,77,46,0.12)' }}>
                        <table className="w-full text-left text-sm">
                          <thead className="bg-primary/5">
                            <tr>
                              <th className="px-4 py-2.5 font-semibold text-primary">{isEnglish ? 'Section' : 'Abschnitt'}</th>
                              <th className="px-4 py-2.5 font-semibold text-primary">{isEnglish ? 'Focus' : 'Fokus'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {articleForSections.sections.map((section, index) => {
                              const headingText = section.heading || `Section ${index + 1}`
                              const sectionId = toSectionId(headingText) || `section-${index + 1}`
                              return (
                              <tr key={`toc-row-${sectionId}`} className="border-t border-primary/10 hover:bg-primary/5 transition-colors">
                                <td className="px-4 py-2.5">
                                  <a
                                    href={`#${sectionId}`}
                                    className="group inline-flex w-full items-center justify-between rounded-md px-2 py-1.5 font-semibold text-primary hover:bg-primary/10 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                                  >
                                    <span className="group-hover:text-primary/90">{index + 1}. {headingText}</span>
                                  </a>
                                </td>
                                <td className="px-4 py-2.5 text-muted-foreground">
                                  {(section.paragraphs && section.paragraphs[0]) || '—'}
                                </td>
                              </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <div className="space-y-10">
                      {articleForSections.sections.map((section, index) => {
                        const headingText = section.heading || `Section ${index + 1}`
                        const sectionId = toSectionId(headingText) || `section-${index + 1}`
                        return (
                    <section key={sectionId} id={sectionId} className="scroll-mt-24">
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-3">
                        {headingText}
                      </h2>
                      <div className="space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
                        {section.paragraphs?.map((paragraph, index) => (
                          <p key={`${section.heading}-${index}`}>{paragraph}</p>
                        ))}
                      </div>

                      {section.bullets && (
                        <ul className="mt-4 space-y-2">
                          {section.bullets.map((item, index) => (
                            <li key={`${section.heading}-bullet-${index}`} className="flex items-start gap-2.5 text-sm sm:text-base text-foreground/90">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#c19a6b]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.paragraphsAfterBullets && (
                        <div className="mt-4 space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
                          {section.paragraphsAfterBullets.map((paragraph, index) => (
                            <p key={`${section.heading}-after-bullets-${index}`}>{paragraph}</p>
                          ))}
                        </div>
                      )}

                      {section.images && section.images.length > 0 && (
                        <div className="mt-5 space-y-4">
                          {section.images
                            .filter((image) => image?.url)
                            .map((image, imageIndex) => (
                              <figure key={`${section.heading}-image-${imageIndex}`} className="space-y-2">
                                <div className="overflow-hidden rounded-xl" style={{ border: '1px solid rgba(26,77,46,0.14)' }}>
                                  <img
                                    src={image.url}
                                    alt={image.alt || image.caption || headingText}
                                    className="w-full h-auto object-cover"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </div>
                                {image.caption && (
                                  <figcaption className="text-xs sm:text-sm text-muted-foreground">{image.caption}</figcaption>
                                )}
                              </figure>
                            ))}
                        </div>
                      )}

                      {section.cards && (
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          {section.cards.map((card) => (
                            <div
                              key={card.title}
                              className="rounded-xl bg-white p-4"
                              style={{ border: '1px solid rgba(26,77,46,0.12)', boxShadow: '0 1px 4px rgba(26,77,46,0.05)' }}
                            >
                              <h3 className="text-sm font-bold text-primary mb-2">{card.title}</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.tableRows && (
                        <div className="mt-5 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(26,77,46,0.14)' }}>
                          <table className="w-full text-left text-sm">
                            <tbody>
                              {section.tableRows.map((row) => (
                                <tr key={`${section.heading}-${row.label}`} className="border-t first:border-t-0" style={{ borderColor: 'rgba(26,77,46,0.12)' }}>
                                  <th
                                    className="w-[36%] px-4 py-2.5 font-semibold text-primary"
                                    style={{
                                      background: 'rgba(26,77,46,0.06)',
                                    }}
                                  >
                                    {row.label}
                                  </th>
                                  <td
                                    className={`px-4 py-2.5 font-medium ${
                                      row.tone === 'success' ? 'text-primary' : row.tone === 'warning' ? 'text-foreground' : 'text-foreground/90'
                                    }`}
                                    style={{
                                      background:
                                        row.tone === 'success'
                                          ? 'linear-gradient(90deg, rgba(26,77,46,0.10), rgba(26,77,46,0.16))'
                                          : row.tone === 'warning'
                                            ? 'linear-gradient(90deg, rgba(193,154,107,0.18), rgba(193,154,107,0.24))'
                                            : 'rgba(255,255,255,0.85)',
                                    }}
                                  >
                                    {row.value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {section.quote && (
                        <p className="mt-5 text-xl sm:text-2xl leading-relaxed italic font-heading" style={{ color: '#1f4c87' }}>
                          {section.quote}
                        </p>
                      )}

                      {section.paragraphsAfterQuote && (
                        <div className="mt-4 space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
                          {section.paragraphsAfterQuote.map((paragraph, index) => (
                            <p key={`${section.heading}-after-quote-${index}`}>{paragraph}</p>
                          ))}
                        </div>
                      )}

                      {section.tip && (
                        <div
                          className="mt-4 rounded-xl p-4 sm:p-5"
                          style={{
                            border: '1px solid rgba(193,154,107,0.35)',
                            background: 'linear-gradient(135deg, rgba(193,154,107,0.10), rgba(26,77,46,0.06))',
                          }}
                        >
                          <p className="text-sm sm:text-base text-foreground/95 leading-relaxed">
                            <span className="inline-flex items-center gap-1.5 font-bold" style={{ color: '#946b33' }}>
                              <Lightbulb className="h-4 w-4" />
                              Baufiking Tip:
                            </span>{' '}
                            {section.tip}
                          </p>
                        </div>
                      )}
                    </section>
                  )})}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl bg-primary/5 p-5 sm:p-6 mb-8" style={{ border: '1px solid rgba(26,77,46,0.12)' }}>
                      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                        {activePost.excerpt || cmsPreparedContent.introText || 'Strategic, practical guidance from Baufiking.'}
                      </p>
                    </div>

                    {cmsPreparedContent.headings.length > 0 && (
                      <section className="mb-10">
                        <h2 className="text-lg sm:text-xl font-heading font-bold text-primary mb-1">
                          {isEnglish ? 'Table of Contents' : 'Inhaltsverzeichnis'}
                        </h2>
                        <p className="text-xs text-muted-foreground mb-3">
                          {isEnglish ? 'Click any section to jump directly.' : 'Klicken Sie auf einen Abschnitt, um direkt zu springen.'}
                        </p>
                        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(26,77,46,0.12)' }}>
                          <table className="w-full text-left text-sm">
                            <thead className="bg-primary/5">
                              <tr>
                                <th className="px-4 py-2.5 font-semibold text-primary">{isEnglish ? 'Section' : 'Abschnitt'}</th>
                                <th className="px-4 py-2.5 font-semibold text-primary">{isEnglish ? 'Focus' : 'Fokus'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cmsPreparedContent.headings.map((heading, index) => (
                                <tr key={`toc-row-${heading.id}`} className="border-t border-primary/10 hover:bg-primary/5 transition-colors">
                                  <td className="px-4 py-2.5">
                                    <a
                                      href={`#${heading.id}`}
                                      className="group inline-flex w-full items-center justify-between rounded-md px-2 py-1.5 font-semibold text-primary hover:bg-primary/10 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                                    >
                                      <span className="group-hover:text-primary/90">{index + 1}. {heading.text}</span>
                                    </a>
                                  </td>
                                  <td className="px-4 py-2.5 text-muted-foreground">{heading.focus}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    )}

                    <div
                      className="blog-rich-content text-foreground/90"
                      dangerouslySetInnerHTML={{ __html: cmsPreparedContent.html }}
                    />
                  </>
                )}
              </article>
            </section>
          </>
        )}

        {slug && (!activePost || !activePost.isLive) && (
          <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10 xl:px-12 py-16">
            <div className="rounded-2xl bg-white p-8 text-center" style={{ border: '1.5px solid rgba(26,77,46,0.10)' }}>
              <h2 className="text-2xl font-heading font-bold text-primary mb-2">
                {isEnglish ? 'Article not available yet' : 'Artikel noch nicht verfuegbar'}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {isEnglish
                  ? 'This post is currently in draft mode and will be published soon.'
                  : 'Dieser Beitrag befindet sich im Entwurfsmodus und wird bald veroeffentlicht.'}
              </p>
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                {isEnglish ? 'Go to blog list' : 'Zur Blogliste'}
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer language={language} />
    </div>
  )
}

export default BlogPage
