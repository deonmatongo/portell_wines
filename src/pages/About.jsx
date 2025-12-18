import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wine, Heart, Award, Users } from 'lucide-react';

export default function About() {
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = {
    pl: {
      hero: {
        title: 'O Portell',
        subtitle: 'Pasja do wina, szacunek dla tradycji'
      },
      story: {
        title: 'Nasza historia',
        content: 'Portell powstało z marzeń i pasji do tworzenia wyjątkowych win. Od ponad 15 lat uprawiamy winorośl na malowniczych wzgórzach, łącząc tradycyjne metody z nowoczesnymi technologiami. Każda butelka naszego wina to opowieść o ziemi, klimacie i ludziach, którzy z miłością dbają o każdy szczegół.'
      },
      values: {
        title: 'Nasze wartości',
        quality: {
          title: 'Jakość',
          desc: 'Nigdy nie idziemy na kompromis w kwestii jakości. Od winnicy po butelkę, każdy etap jest starannie kontrolowany.'
        },
        tradition: {
          title: 'Tradycja',
          desc: 'Szanujemy tradycyjne metody winiarskie, przekazywane z pokolenia na pokolenie.'
        },
        innovation: {
          title: 'Innowacja',
          desc: 'Nie boimy się eksperymentować i wprowadzać nowoczesnych rozwiązań dla lepszych rezultatów.'
        },
        sustainability: {
          title: 'Zrównoważony rozwój',
          desc: 'Dbamy o środowisko i stosujemy praktyki przyjazne naturze w całym procesie produkcji.'
        }
      },
      team: {
        title: 'Nasz zespół',
        desc: 'Za sukcesem Portell stoi zespół pasjonatów, dla których wino to nie tylko praca, ale prawdziwa miłość.'
      }
    },
    en: {
      hero: {
        title: 'About Portell',
        subtitle: 'Passion for wine, respect for tradition'
      },
      story: {
        title: 'Our story',
        content: 'Portell was born from dreams and passion for creating exceptional wines. For over 15 years, we have been cultivating vines on picturesque hills, combining traditional methods with modern technologies. Each bottle of our wine tells a story of land, climate, and people who lovingly care for every detail.'
      },
      values: {
        title: 'Our values',
        quality: {
          title: 'Quality',
          desc: 'We never compromise on quality. From vineyard to bottle, every stage is carefully monitored.'
        },
        tradition: {
          title: 'Tradition',
          desc: 'We respect traditional winemaking methods, passed down through generations.'
        },
        innovation: {
          title: 'Innovation',
          desc: "We're not afraid to experiment and introduce modern solutions for better results."
        },
        sustainability: {
          title: 'Sustainability',
          desc: 'We care for the environment and apply nature-friendly practices throughout our production.'
        }
      },
      team: {
        title: 'Our team',
        desc: 'Behind Portell\'s success is a team of enthusiasts for whom wine is not just work, but true love.'
      }
    }
  }[language];

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="relative py-32 px-6 lg:px-12 bg-gradient-to-br from-neutral-100 to-neutral-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600')] bg-cover bg-center opacity-5" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              {t.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-light tracking-tight text-neutral-900 mb-6">
                {t.story.title}
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                {t.story.content}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-square bg-neutral-100 rounded-sm overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1543418219-44e30b057fea?w=800"
                alt="Vineyard"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
              {t.values.title}
            </h2>
            <div className="w-16 h-0.5 bg-[var(--portell-burgundy)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, ...t.values.quality },
              { icon: Heart, ...t.values.tradition },
              { icon: Wine, ...t.values.innovation },
              { icon: Users, ...t.values.sustainability }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="bg-white rounded-sm p-8 text-center shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-[var(--portell-burgundy)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-[var(--portell-burgundy)]" />
                </div>
                <h3 className="text-xl font-light text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
              {t.team.title}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t.team.desc}
            </p>
          </div>

          <div className="aspect-[21/9] bg-neutral-100 rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1600"
              alt="Team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}