import React from 'react';
import { Sequence } from 'remotion';
import { cinematicScenes } from './cinematic/timeline';
import { Dive, Fly, Space, Book, Outro } from './cinematic/CinematicScenes';

const COMPONENTS: Record<string, React.FC> = {
  dive: Dive,
  fly: Fly,
  space: Space,
  book: Book,
  outro: Outro,
};

/**
 * 电影运镜版主组件。
 * 虽然是 Sequence 串联，但每个场景内部镜头都在持续运动，
 * 且场景首尾镜头状态衔接（推进→横移→拉远），观感接近一镜到底。
 */
export const CinematicTimeline: React.FC = () => (
  <>
    {cinematicScenes.map((scene) => {
      const Scene = COMPONENTS[scene.id];
      return (
        <Sequence key={scene.id} from={scene.start} durationInFrames={scene.duration} name={scene.id}>
          <Scene />
        </Sequence>
      );
    })}
  </>
);
