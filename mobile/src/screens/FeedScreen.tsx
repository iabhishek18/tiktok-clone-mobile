import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, Dimensions, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPost {
  id: string;
  videoUrl: string;
  user: { name: string; avatar: string };
  description: string;
  likes: number;
  comments: number;
  shares: number;
  song: string;
  isLiked: boolean;
}

export default function FeedScreen() {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const renderItem = ({ item, index }: { item: VideoPost; index: number }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item.videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={index === currentIndex}
        isLooping
        isMuted={false}
      />
      <View style={styles.overlay}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>@{item.user.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.songRow}>
            <Music size={14} color="white" />
            <Text style={styles.songText}>{item.song}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <ActionButton icon={<Heart size={28} color={item.isLiked ? "#ff2d55" : "white"} fill={item.isLiked ? "#ff2d55" : "none"} />} count={item.likes} />
          <ActionButton icon={<MessageCircle size={28} color="white" />} count={item.comments} />
          <ActionButton icon={<Share2 size={28} color="white" />} count={item.shares} />
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={SCREEN_HEIGHT}
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
    />
  );
}

function ActionButton({ icon, count }: { icon: React.ReactNode; count: number }) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
      {icon}
      <Text style={styles.actionCount}>{count > 999 ? `${(count/1000).toFixed(1)}K` : count}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  videoContainer: { height: SCREEN_HEIGHT, position: 'relative' },
  video: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, paddingBottom: 60 },
  userInfo: { flex: 1, justifyContent: 'flex-end' },
  username: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  description: { color: 'white', marginTop: 4 },
  songRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  songText: { color: 'white', marginLeft: 6, fontSize: 12 },
  actions: { justifyContent: 'flex-end', alignItems: 'center', gap: 20 },
  actionBtn: { alignItems: 'center' },
  actionCount: { color: 'white', fontSize: 12, marginTop: 4 },
});
