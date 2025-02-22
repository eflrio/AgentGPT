import { type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import React, { useEffect } from "react";
import type { Message } from "../components/ChatWindow";
import ChatWindow from "../components/ChatWindow";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaRobot, FaStar } from "react-icons/fa";
import PopIn from "../components/motions/popin";
import { VscLoading } from "react-icons/vsc";
import AutonomousAgent from "../components/AutonomousAgent";
import Expand from "../components/motions/expand";
import HelpDialog from "../components/HelpDialog";
import SettingsDialog from "../components/SettingsDialog";

const Home: NextPage = () => {
  const [name, setName] = React.useState<string>("");
  const [goalInput, setGoalInput] = React.useState<string>("");
  const [agent, setAgent] = React.useState<AutonomousAgent | null>(null);
  const [customApiKey, setCustomApiKey] = React.useState<string>("");
  const [shouldAgentStop, setShouldAgentStop] = React.useState(false);

  const [messages, setMessages] = React.useState<Message[]>([]);

  const [showHelpDialog, setShowHelpDialog] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);

  useEffect(() => {
    const key = "agentgpt-modal-opened-new";
    const savedModalData = localStorage.getItem(key);

    // Momentarily always run
    setTimeout(() => {
      if (savedModalData == null) {
        setShowHelpDialog(true);
      } else {
        setShowSettingsDialog(true);
      }
    }, 1500);

    localStorage.setItem(key, JSON.stringify(true));
  }, []);

  useEffect(() => {
    if (agent == null) {
      setShouldAgentStop(false);
    }
  }, [agent]);

  const handleNewGoal = () => {
    const addMessage = (message: Message) =>
      setMessages((prev) => [...prev, message]);
    const agent = new AutonomousAgent(
      name,
      goalInput,
      addMessage,
      () => setAgent(null),
      customApiKey
    );
    setAgent(agent);
    agent.run().then(console.log).catch(console.error);
  };

  const handleStopAgent = () => {
    setShouldAgentStop(true);
    agent?.stopAgent();
  };

  return (
    <DefaultLayout>
      <HelpDialog
        show={showHelpDialog}
        close={() => setShowHelpDialog(false)}
      />
      <SettingsDialog
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
        show={showSettingsDialog}
        close={() => setShowSettingsDialog(false)}
      />
      <main className="flex h-screen w-screen flex-row">
        <Drawer
          showHelp={() => setShowHelpDialog(true)}
          showSettings={() => setShowSettingsDialog(true)}
        />
        <div
          id="content"
          className="z-10 flex h-screen w-full items-center justify-center p-2 px-2 sm:px-4 md:px-10"
        >
          <div
            id="layout"
            className="flex h-full w-full max-w-screen-lg flex-col items-center justify-between gap-3 py-5 md:justify-center"
          >
            <div
              id="title"
              className="relative flex flex-col items-center font-mono"
            >
              <div className="flex flex-row items-start shadow-2xl">
                <span className="text-4xl font-bold text-[#C0C0C0] xs:text-5xl sm:text-6xl">
                  Agent
                </span>
                <span className="text-4xl font-bold text-white xs:text-5xl sm:text-6xl">
                  GPT
                </span>
                <PopIn delay={0.5}>
                  <Badge>Beta 🚀</Badge>
                </PopIn>
              </div>
              <div className="mt-1 text-center font-mono text-[0.7em] font-bold text-white">
                Assemble, configure, and deploy autonomous AI Agents in your
                browser.
              </div>
            </div>

            <Expand className="w-full">
              <ChatWindow className="mt-4" messages={messages} />
            </Expand>

            <div className="mt-10 flex w-full flex-col gap-2">
              <Input
                left={
                  <>
                    <FaRobot />
                    <span className="ml-2">Name:</span>
                  </>
                }
                value={name}
                disabled={agent != null}
                onChange={(e) => setName(e.target.value)}
                placeholder="AgentGPT"
              />

              <Input
                left={
                  <>
                    <FaStar />
                    <span className="ml-2">Goal:</span>
                  </>
                }
                disabled={agent != null}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Make the world a better place."
              />
            </div>

            <div className="flex gap-2">
              <Button
                disabled={agent != null || name === "" || goalInput === ""}
                onClick={handleNewGoal}
                className="mt-10"
              >
                {agent == null ? (
                  "Deploy Agent"
                ) : (
                  <>
                    <VscLoading className="animate-spin" size={20} />
                    <span className="ml-2">Running</span>
                  </>
                )}
              </Button>

              <Button
                disabled={agent == null}
                onClick={handleStopAgent}
                className="mt-10"
                enabledClassName={"bg-red-600 hover:bg-red-400"}
              >
                {shouldAgentStop ? (
                  <>
                    <VscLoading className="animate-spin" size={20} />
                    <span className="ml-2">Stopping</span>
                  </>
                ) : (
                  "Stop agent"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default Home;
