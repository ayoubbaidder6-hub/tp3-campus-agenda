
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

type Statut = 'Complet' | 'Presque complet' | 'Ouvert';

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

const placesRestantes = (e: Evenement): number => {
  return Math.max(0, e.capacite - e.inscrits);
};

const statutEvenement = (e: Evenement): Statut => {
  const places = placesRestantes(e);

  if (places === 0) return 'Complet';
  if (places <= 3) return 'Presque complet';
  return 'Ouvert';
};

const totalEvenements = evenements.length;

const evenementsComplets = evenements.filter(
  e => placesRestantes(e) === 0
).length;

const evenementsDisponibles = evenements.filter(
  e => placesRestantes(e) > 0
).length;

const totalPlaces = evenements.reduce(
  (total, e) => total + placesRestantes(e), 0
);

const ateliersDisponibles = evenements.filter(
  e => e.categorie === 'Atelier' && placesRestantes(e) > 0
);

const mode: 'tous' | 'ateliers' = 'tous';

const listeAffichee =
  mode === 'tous' ? evenements : ateliersDisponibles;

type BadgeEtatProps = {
  statut: Statut;
};

const BadgeEtat = ({ statut }: BadgeEtatProps) => {
  let couleur = '#DCFCE7';

  if (statut === 'Complet') couleur = '#FEE2E2';
  else if (statut === 'Presque complet') couleur = '#FFEDD5';

  return (
    <View style={[styles.badge, { backgroundColor: couleur }]}>
      <Text style={styles.badgeText}>{statut}</Text>
    </View>
  );
};

type CarteEvenementProps = {
  evenement: Evenement;
};

const CarteEvenement = ({ evenement }: CarteEvenementProps) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.titreCarte}>{evenement.titre}</Text>
      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>

    <Text style={styles.categorie}>{evenement.categorie}</Text>
    <Text style={styles.places}>
      {placesRestantes(evenement)} places restantes
    </Text>
  </View>
);

type BlocStatistiqueProps = {
  libelle: string;
  nombre: number;
};

const BlocStatistique = ({ libelle, nombre }: BlocStatistiqueProps) => (
  <View style={styles.statCard}>
    <Text style={styles.statNombre}>{nombre}</Text>
    <Text style={styles.statLibelle}>{libelle}</Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listeAffichee}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.appTitle}>CampusAgenda</Text>
              <Text style={styles.subtitle}>Événements du campus</Text>
            </View>

            <View style={styles.statsContainer}>
              <BlocStatistique libelle="Événements au total" nombre={totalEvenements} />
              <BlocStatistique libelle="Événements complets" nombre={evenementsComplets} />
              <BlocStatistique libelle="Événements disponibles" nombre={evenementsDisponibles} />
              <BlocStatistique libelle="Places restantes" nombre={totalPlaces} />
            </View>

            <Text style={styles.sectionTitle}>
              {mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucun événement disponible pour le moment.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  listContent: {
    padding: 18,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#263B80',
    padding: 25,
    borderRadius: 18,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 15,
    color: '#DCE4FF',
    marginTop: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statNombre: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#263B80',
  },
  statLibelle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#263B80',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 15,
    marginBottom: 13,
    borderLeftWidth: 5,
    borderLeftColor: '#5269B5',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  titreCarte: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#263B80',
    flexShrink: 1,
  },
  categorie: {
    fontSize: 13,
    color: '#777777',
    marginTop: 8,
  },
  places: {
    fontSize: 14,
    color: '#333333',
    marginTop: 10,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
  },
  emptyContainer: {
    padding: 25,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
  },
});
