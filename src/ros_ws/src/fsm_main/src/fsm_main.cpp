#include <chrono>
#include <functional>
#include <memory>
#include <string>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"
#include "audio_kws_msgs/msg/kws_stamped.hpp"

using std::placeholders::_1;

class FSM : public rclcpp::Node
{
public:
    enum class FSMState
    {
        WELCOME,
        CHOOSE
    };

    enum class MealyInput
    {
        ROBOBOOK,
        KEMBALI,
        BACAKAN_BUKU,
        CARIKAN_BUKU,
        UNKNOWN
    };

    FSM() : Node("fsm_node"), count_(0)
    {
        current_state_ = FSMState::WELCOME;
        kws_output_ = MealyInput::UNKNOWN;

        publisher_ =
            this->create_publisher<std_msgs::msg::String>("ui_route", 10);

        kws_sub_ =
            this->create_subscription<audio_kws_msgs::msg::KWSStamped>(
                "KWS_prediction",
                10,
                std::bind(&FSM::kws_sub_callback, this, _1));
    }

private:
    // ---------------- FSM OUTPUT ----------------
    void web_update(const std::string &web_address)
    {
        std_msgs::msg::String msg;
        msg.data = web_address;
        publisher_->publish(msg);

        RCLCPP_INFO(get_logger(), "UI route -> %s", msg.data.c_str());
    }

    // ---------------- KWS INPUT ----------------
    void kws_sub_callback(
        const audio_kws_msgs::msg::KWSStamped::SharedPtr msg)
    {
        const auto &label = msg->prediction.label;

        // RCLCPP_INFO(get_logger(),"KWS -> %s",label.c_str());

        if (label == "unknown" || label == "noise")
        {
            kws_output_ = MealyInput::UNKNOWN;
            return;
        }
        else
        {
            if (label == "robobook")
                kws_output_ = MealyInput::ROBOBOOK;
            else if (label == "kembali")
                kws_output_ = MealyInput::KEMBALI;
            else if (label == "bacakan_buku")
                kws_output_ = MealyInput::BACAKAN_BUKU;
            else if (label == "carikan_buku")
                kws_output_ = MealyInput::CARIKAN_BUKU;
            main_fsm(kws_output_);
        }
    }

    // ---------------- FSM CORE ----------------
    void main_fsm(MealyInput input)
    {
        switch (current_state_)
        {

        case FSMState::WELCOME:
            switch (input)
            {
            case MealyInput::ROBOBOOK:
                current_state_ = FSMState::CHOOSE;
                web_update("select");
                break;
            default:
                break;
            }
            break;

        case FSMState::CHOOSE:
            switch (input)
            {
            case MealyInput::KEMBALI:
                current_state_ = FSMState::WELCOME;
                web_update("home");
                break;
            default:
                break;
            }
            break;
        }
    }

    // ---------------- MEMBERS ----------------
    FSMState current_state_;
    MealyInput kws_output_;

    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
    rclcpp::Subscription<audio_kws_msgs::msg::KWSStamped>::SharedPtr kws_sub_;

    size_t count_;
};

int main(int argc, char *argv[])
{
    rclcpp::init(argc, argv);
    rclcpp::spin(std::make_shared<FSM>());
    rclcpp::shutdown();
    return 0;
}
